/** Data contoh sintetis, tidak berisi akun asli. */
export function sampleFiles(): string[] {
  const followerNames = ["ayu", "budi", "citra", "dewi", "eko", "fajar", "gita"];
  const followingNames = ["budi", "citra", "hana", "indra", "joko", "gita"];

  const followers = followerNames.map((n) => ({
    title: "",
    media_list_data: [],
    string_list_data: [
      { href: `https://www.instagram.com/${n}`, value: n, timestamp: 1700000000 },
    ],
  }));

  const following = {
    relationships_following: followingNames.map((n) => ({
      title: n,
      string_list_data: [
        { href: `https://www.instagram.com/_u/${n}`, timestamp: 1700000000 },
      ],
    })),
  };

  return [JSON.stringify(followers), JSON.stringify(following)];
}
