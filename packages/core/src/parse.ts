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

export type Kind = "followers" | "following";

/** Tentukan apakah JSON adalah daftar followers atau following. */
export function detectKind(data: unknown): Kind {
  if (Array.isArray(data)) return "followers";
  if (data && typeof data === "object") {
    const rec = data as Record<string, unknown>;
    if (Array.isArray(rec.relationships_following)) return "following";
    if (Array.isArray(rec.relationships_followers)) return "followers";
  }
  throw new ParseError(
    "Format JSON tidak dikenal. Pakai followers_1.json atau following.json dari export Instagram."
  );
}

/** Gabungkan banyak file teks JSON menjadi himpunan followers dan following. */
export function parseFiles(texts: string[]): {
  followers: Set<string>;
  following: Set<string>;
} {
  const followers = new Set<string>();
  const following = new Set<string>();
  let sawFollowers = false;
  let sawFollowing = false;
  for (const text of texts) {
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new ParseError("File bukan JSON yang valid.");
    }
    const kind = detectKind(data);
    const target = kind === "followers" ? followers : following;
    for (const name of parseUsernames(data)) target.add(name);
    if (kind === "followers") sawFollowers = true;
    else sawFollowing = true;
  }
  if (!sawFollowers || !sawFollowing) {
    throw new ParseError(
      "Butuh dua jenis file: followers_1.json dan following.json."
    );
  }
  return { followers, following };
}

export interface ApiPage {
  usernames: string[];
  nextMaxId: string | null;
}

/** Parse satu halaman respons endpoint friendships Instagram (followers atau following). */
export function parseApiPage(data: unknown): ApiPage {
  if (!data || typeof data !== "object") {
    throw new ParseError("Respons Instagram tidak valid.");
  }
  const rec = data as Record<string, unknown>;
  if (!Array.isArray(rec.users)) {
    throw new ParseError("Respons Instagram tidak berisi daftar pengguna.");
  }
  const usernames: string[] = [];
  for (const u of rec.users) {
    const name =
      u && typeof u === "object"
        ? nonEmptyString((u as Record<string, unknown>).username)
        : "";
    if (name) usernames.push(normalizeUsername(name));
  }
  const next = rec.next_max_id;
  const nextMaxId =
    typeof next === "string" && next ? next : typeof next === "number" ? String(next) : null;
  return { usernames, nextMaxId };
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
