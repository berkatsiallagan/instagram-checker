import type { Result } from "./diff";

function cell(value: string): string {
  // Cegah formula injection di spreadsheet.
  let v = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  if (/[",\n\r]/.test(v)) v = `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function toCsv(result: Result): string {
  const rows: string[] = ["username,kategori"];
  const add = (list: string[] | undefined, label: string) => {
    if (list) list.forEach((u) => rows.push(`${cell(u)},${label}`));
  };
  add(result.notFollowingBack, "tidak_follback");
  add(result.fans, "fans");
  add(result.mutual, "mutual");
  add(result.pendingRequests, "permintaan_tertunda");
  add(result.recentlyUnfollowed, "baru_unfollow");
  add(result.closeFriends, "teman_dekat");
  add(result.blockedProfiles, "diblokir");
  add(result.restrictedProfiles, "dibatasi");
  add(result.hideStoryFrom, "sembunyikan_cerita");
  add(result.recentRequests, "permintaan_baru");
  add(result.removedSuggestions, "saran_dihapus");
  return rows.join("\n") + "\n";
}
