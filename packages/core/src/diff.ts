export type ExtraCategoryKey =
  | "pendingRequests"
  | "recentlyUnfollowed"
  | "closeFriends"
  | "blockedProfiles"
  | "restrictedProfiles"
  | "hideStoryFrom"
  | "recentRequests"
  | "removedSuggestions";

export interface Result {
  /** Kamu follow, mereka tidak follow balik. */
  notFollowingBack: string[];
  /** Mereka follow kamu, kamu belum follow balik. */
  fans: string[];
  /** Saling follow. */
  mutual: string[];
  /** Permintaan follow keluar yang masih pending */
  pendingRequests?: string[];
  /** Akun yang baru saja kamu unfollow */
  recentlyUnfollowed?: string[];
  /** Teman dekat (Close Friends) */
  closeFriends?: string[];
  /** Akun yang kamu blokir */
  blockedProfiles?: string[];
  /** Akun yang kamu batasi (Restricted) */
  restrictedProfiles?: string[];
  /** Akun yang disembunyikan dari ceritamu */
  hideStoryFrom?: string[];
  /** Permintaan follow terbaru */
  recentRequests?: string[];
  /** Saran akun yang kamu hapus/sembunyikan */
  removedSuggestions?: string[];
}

export function diff(
  followers: ReadonlySet<string>,
  following: ReadonlySet<string>,
  extras: Partial<Record<ExtraCategoryKey, ReadonlySet<string>>> = {}
): Result {
  const sort = (a: string[]) => a.sort((x, y) => x.localeCompare(y));
  const res: Result = {
    notFollowingBack: sort([...following].filter((u) => !followers.has(u))),
    fans: sort([...followers].filter((u) => !following.has(u))),
    mutual: sort([...following].filter((u) => followers.has(u))),
  };

  const extraKeys: ExtraCategoryKey[] = [
    "pendingRequests",
    "recentlyUnfollowed",
    "closeFriends",
    "blockedProfiles",
    "restrictedProfiles",
    "hideStoryFrom",
    "recentRequests",
    "removedSuggestions",
  ];

  for (const k of extraKeys) {
    const set = extras[k];
    if (set !== undefined) {
      res[k] = sort([...set]);
    }
  }

  return res;
}
