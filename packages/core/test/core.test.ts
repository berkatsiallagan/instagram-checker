import { describe, expect, it } from "vitest";
import { ParseError, diff, parseText, parseUsernames, toCsv } from "../src";

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

  it("menolak entri non-objek", () => {
    expect(() => parseUsernames([1])).toThrow(ParseError);
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
