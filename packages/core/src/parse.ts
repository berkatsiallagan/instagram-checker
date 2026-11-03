export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}

interface StringListItem {
  href?: unknown;
  value?: unknown;
}

interface Entry {
  title?: unknown;
  string_list_data?: unknown;
}

const LIST_KEYS = ["relationships_following", "relationships_followers"];

export function normalizeUsername(raw: string): string {
  return raw.trim().replace(/^@/, "").toLowerCase();
}

function usernameFromHref(href: string): string {
  try {
    const parts = new URL(href).pathname.split("/").filter(Boolean);
    if (parts[0] === "_u") return parts[1] ?? "";
    return parts[0] ?? "";
  } catch {
    return "";
  }
}

function nonEmptyString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function usernameFromEntry(entry: Entry): string {
  const title = nonEmptyString(entry.title);
  if (title) return normalizeUsername(title);

  const items = Array.isArray(entry.string_list_data)
    ? (entry.string_list_data as StringListItem[])
    : [];
  const first = items[0];
  if (!first || typeof first !== "object") return "";

  const value = nonEmptyString(first.value);
  if (value) return normalizeUsername(value);

  return normalizeUsername(usernameFromHref(nonEmptyString(first.href)));
}

function extractEntries(data: unknown): Entry[] {
  if (Array.isArray(data)) return data as Entry[];
  if (data && typeof data === "object") {
    for (const key of LIST_KEYS) {
      const list = (data as Record<string, unknown>)[key];
      if (Array.isArray(list)) return list as Entry[];
    }
  }
  throw new ParseError(
    "Format JSON tidak dikenal. Pakai followers_1.json atau following.json dari export Instagram."
  );
}

/** Ambil daftar username dari objek JSON export Instagram (followers atau following). */
export function parseUsernames(data: unknown): Set<string> {
  const entries = extractEntries(data);
  const result = new Set<string>();
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") {
      throw new ParseError("Ada entri yang bukan objek di dalam file JSON.");
    }
    const name = usernameFromEntry(entry);
    if (name) result.add(name);
  }
  return result;
}

/** Sama seperti parseUsernames, tapi menerima teks mentah file. */
export function parseText(text: string): Set<string> {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ParseError("File bukan JSON yang valid.");
  }
  return parseUsernames(data);
}
