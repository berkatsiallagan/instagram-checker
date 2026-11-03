import type { Result } from "./diff";

function cell(value: string): string {
  // Cegah formula injection di spreadsheet.
  let v = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  if (/[",\n\r]/.test(v)) v = `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function toCsv(result: Result): string {
  const rows: string[] = ["username,kategori"];
  const add = (list: string[], label: string) =>
    list.forEach((u) => rows.push(`${cell(u)},${label}`));
  add(result.notFollowingBack, "tidak_follback");
  add(result.fans, "fans");
  add(result.mutual, "mutual");
  return rows.join("\n") + "\n";
}
