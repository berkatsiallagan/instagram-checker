export interface Result {
  /** Kamu follow, mereka tidak follow balik. */
  notFollowingBack: string[];
  /** Mereka follow kamu, kamu belum follow balik. */
  fans: string[];
  /** Saling follow. */
  mutual: string[];
}

export function diff(
  followers: ReadonlySet<string>,
  following: ReadonlySet<string>
): Result {
  const sort = (a: string[]) => a.sort((x, y) => x.localeCompare(y));
  return {
    notFollowingBack: sort([...following].filter((u) => !followers.has(u))),
    fans: sort([...followers].filter((u) => !following.has(u))),
    mutual: sort([...following].filter((u) => followers.has(u))),
  };
}
