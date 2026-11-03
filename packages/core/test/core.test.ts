import { describe, expect, it } from "vitest";
import {
  ParseError,
  diff,
  parseApiPage,
  parseFiles,
  parseText,
  parseUsernames,
  toCsv,
} from "../src";

const followersJson = [
  {
    title: "",
    media_list_data: [],
    string_list_data: [
      { href: "https://www.instagram.com/Alice", value: "Alice", timestamp: 1 },
    ],
  },
  {
    title: "",
    string_list_data: [{ href: "https://www.instagram.com/bob", value: "bob" }],
  },
];

const followingJson = {
  relationships_following: [
    {
      title: "bob",
      string_list_data: [{ href: "https://www.instagram.com/_u/bob", timestamp: 2 }],
    },
    {
      title: "carol",
      string_list_data: [{ href: "https://www.instagram.com/_u/carol" }],
    },
  ],
};

describe("parseUsernames", () => {
  it("membaca format followers (array, username di value)", () => {
    expect([...parseUsernames(followersJson)].sort()).toEqual(["alice", "bob"]);
  });

  it("membaca format following (username di title)", () => {
    expect([...parseUsernames(followingJson)].sort()).toEqual(["bob", "carol"]);
  });

  it("fallback ke href jika title dan value kosong", () => {
    const data = [{ title: "", string_list_data: [{ href: "https://www.instagram.com/_u/Dave" }] }];
    expect([...parseUsernames(data)]).toEqual(["dave"]);
  });

  it("menolak bentuk tidak dikenal", () => {
    expect(() => parseUsernames({ foo: 1 })).toThrow(ParseError);
  });

  it("menolak JSON rusak", () => {
    expect(() => parseText("{bukan json")).toThrow(ParseError);
  });

  it("membaca format array string username langsung", () => {
    expect([...parseUsernames(["john", "doe"])].sort()).toEqual(["doe", "john"]);
  });

  it("membaca format objek dengan properti username/value/href langsung", () => {
    const data = [
      { username: "user_a" },
      { value: "user_b" },
      { href: "https://www.instagram.com/user_c" },
    ];
    expect([...parseUsernames(data)].sort()).toEqual(["user_a", "user_b", "user_c"]);
  });

  it("menolak entri non-objek", () => {
    expect(() => parseUsernames([1])).toThrow(ParseError);
  });
});

describe("parseFiles", () => {
  it("menggabungkan banyak file dan mengenali jenisnya", () => {
    const second = [{ title: "", string_list_data: [{ value: "zed" }] }];
    const { followers, following } = parseFiles([
      JSON.stringify(followersJson),
      JSON.stringify(second),
      JSON.stringify(followingJson),
    ]);
    expect([...followers].sort()).toEqual(["alice", "bob", "zed"]);
    expect([...following].sort()).toEqual(["bob", "carol"]);
  });

  it("gagal jika salah satu jenis tidak ada", () => {
    expect(() => parseFiles([JSON.stringify(followersJson)])).toThrow(ParseError);
  });

  it("gagal pada teks bukan JSON", () => {
    expect(() => parseFiles(["xx"])).toThrow(ParseError);
  });

  it("mengabaikan file lain di dalam folder export Instagram jika tidak dikenali", () => {
    const otherJson = { some_other_data: [1, 2, 3] };
    const { followers, following } = parseFiles([
      JSON.stringify(followersJson),
      JSON.stringify(otherJson),
      JSON.stringify(followingJson),
    ]);
    expect([...followers].sort()).toEqual(["alice", "bob"]);
    expect([...following].sort()).toEqual(["bob", "carol"]);
  });

  it("membaca kategori tambahan dari nama file dan key Instagram", () => {
    const pendingJson = {
      relationships_permanent_follow_requests: [
        { title: "pending_user", string_list_data: [{ value: "pending_user" }] },
      ],
    };
    const { followers, following, extras } = parseFiles([
      { name: "followers_1.json", text: JSON.stringify(followersJson) },
      { name: "following.json", text: JSON.stringify(followingJson) },
      { name: "pending_follow_requests.json", text: JSON.stringify(pendingJson) },
    ]);
    expect([...followers].sort()).toEqual(["alice", "bob"]);
    expect([...following].sort()).toEqual(["bob", "carol"]);
    expect([...(extras.pendingRequests ?? [])]).toEqual(["pending_user"]);

    const res = diff(followers, following, extras);
    expect(res.pendingRequests).toEqual(["pending_user"]);
    const csv = toCsv(res);
    expect(csv).toContain("pending_user,permintaan_tertunda");
  });

  it("tetap menyertakan kategori kosong jika filenya diunggah", () => {
    const { followers, following, extras } = parseFiles([
      { name: "followers_1.json", text: JSON.stringify(followersJson) },
      { name: "following.json", text: JSON.stringify(followingJson) },
      { name: "blocked_profiles.json", text: JSON.stringify({}) },
    ]);
    expect([...followers].sort()).toEqual(["alice", "bob"]);
    expect([...following].sort()).toEqual(["bob", "carol"]);
    expect(extras.blockedProfiles).toBeDefined();
    expect([...extras.blockedProfiles!]).toEqual([]);

    const res = diff(followers, following, extras);
    expect(res.blockedProfiles).toEqual([]);
  });
});

describe("parseApiPage", () => {
  it("membaca users dan next_max_id", () => {
    const page = parseApiPage({
      users: [{ username: "Ann" }, { username: "" }, { pk: 1 }, { username: "bo" }],
      next_max_id: "abc",
    });
    expect(page.usernames).toEqual(["ann", "bo"]);
    expect(page.nextMaxId).toBe("abc");
  });

  it("nextMaxId null di halaman terakhir", () => {
    expect(parseApiPage({ users: [] }).nextMaxId).toBeNull();
  });

  it("menolak respons tanpa users", () => {
    expect(() => parseApiPage({ status: "fail" })).toThrow(ParseError);
    expect(() => parseApiPage(null)).toThrow(ParseError);
  });
});

describe("diff", () => {
  it("memisahkan tiga kategori dan mengurutkan", () => {
    const r = diff(new Set(["alice", "bob"]), new Set(["bob", "carol"]));
    expect(r.notFollowingBack).toEqual(["carol"]);
    expect(r.fans).toEqual(["alice"]);
    expect(r.mutual).toEqual(["bob"]);
  });

  it("menangani himpunan kosong", () => {
    const r = diff(new Set(), new Set());
    expect(r).toEqual({ notFollowingBack: [], fans: [], mutual: [] });
  });
});

describe("toCsv", () => {
  it("menghasilkan header dan baris", () => {
    const csv = toCsv({ notFollowingBack: ["a"], fans: ["b"], mutual: ["c"] });
    expect(csv).toBe("username,kategori\na,tidak_follback\nb,fans\nc,mutual\n");
  });

  it("menetralkan formula injection", () => {
    const csv = toCsv({ notFollowingBack: ["=cmd"], fans: [], mutual: [] });
    expect(csv).toContain("'=cmd,tidak_follback");
  });
});
