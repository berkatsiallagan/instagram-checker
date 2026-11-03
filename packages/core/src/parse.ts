import type { ExtraCategoryKey } from "./diff";
export type { ExtraCategoryKey };

export type ParseErrorCode =
  | "unknown_format"
  | "invalid_json"
  | "bad_entry"
  | "need_both"
  | "bad_api"
  | "api_no_users";

export class ParseError extends Error {
  readonly code: ParseErrorCode;
  constructor(code: ParseErrorCode, message: string) {
    super(message);
    this.name = "ParseError";
    this.code = code;
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

const LIST_KEYS = [
  "relationships_following",
  "relationships_followers",
  "relationships_permanent_follow_requests",
  "relationships_persistent_follow_requests",
  "relationships_follow_requests_sent",
  "relationships_follow_requests_received",
  "relationships_unfollowed_users",
  "relationships_close_friends",
  "relationships_blocked_users",
  "relationships_restricted_users",
  "relationships_hide_stories_from",
  "relationships_dismissed_suggested_users",
];

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
    const rec = data as Record<string, unknown>;
    for (const key of LIST_KEYS) {
      const list = rec[key];
      if (Array.isArray(list)) return list as Entry[];
    }
    for (const key of Object.keys(rec)) {
      if (Array.isArray(rec[key])) return rec[key] as Entry[];
    }
  }
  throw new ParseError(
    "unknown_format",
    "Unrecognized JSON format. Use followers_1.json or following.json from the Instagram export."
  );
}

/** Ambil daftar username dari objek JSON export Instagram. */
export function parseUsernames(data: unknown): Set<string> {
  const entries = extractEntries(data);
  const result = new Set<string>();
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") {
      throw new ParseError("bad_entry", "An entry in the JSON file is not an object.");
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
    "unknown_format",
    "Unrecognized JSON format. Use followers_1.json or following.json from the Instagram export."
  );
}

export type FileCategory = "followers" | "following" | ExtraCategoryKey;

export function detectCategory(data: unknown, filename = ""): FileCategory | null {
  const fn = filename.toLowerCase();

  if (fn.includes("following") && !fn.includes("followers")) return "following";
  if (fn.includes("followers")) return "followers";
  if (fn.includes("pending_follow")) return "pendingRequests";
  if (
    fn.includes("recently_unfollowed") ||
    fn.includes("recently_unfollowed_accounts") ||
    fn.includes("recently_unfollowed_profiles")
  ) {
    return "recentlyUnfollowed";
  }
  if (fn.includes("close_friends")) return "closeFriends";
  if (fn.includes("blocked")) return "blockedProfiles";
  if (fn.includes("restricted")) return "restrictedProfiles";
  if (fn.includes("hide_story") || fn.includes("hide_stories")) return "hideStoryFrom";
  if (fn.includes("recent_follow")) return "recentRequests";
  if (fn.includes("removed_suggestions") || fn.includes("dismissed_suggested")) {
    return "removedSuggestions";
  }

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const rec = data as Record<string, unknown>;
    if (Array.isArray(rec.relationships_following)) return "following";
    if (Array.isArray(rec.relationships_followers)) return "followers";
    if (
      Array.isArray(rec.relationships_permanent_follow_requests) ||
      Array.isArray(rec.relationships_persistent_follow_requests) ||
      Array.isArray(rec.relationships_follow_requests_sent)
    ) {
      return "pendingRequests";
    }
    if (Array.isArray(rec.relationships_unfollowed_users)) return "recentlyUnfollowed";
    if (Array.isArray(rec.relationships_close_friends)) return "closeFriends";
    if (Array.isArray(rec.relationships_blocked_users)) return "blockedProfiles";
    if (Array.isArray(rec.relationships_restricted_users)) return "restrictedProfiles";
    if (Array.isArray(rec.relationships_hide_stories_from)) return "hideStoryFrom";
    if (Array.isArray(rec.relationships_follow_requests_received)) return "recentRequests";
    if (Array.isArray(rec.relationships_dismissed_suggested_users)) return "removedSuggestions";
  }

  if (Array.isArray(data)) return "followers";

  return null;
}

export interface RawFileInput {
  name?: string;
  text: string;
}

export interface ParsedFilesResult {
  followers: Set<string>;
  following: Set<string>;
  extras: Partial<Record<ExtraCategoryKey, Set<string>>>;
}

/** Gabungkan banyak file teks JSON menjadi himpunan followers, following, dan kategori tambahan. */
export function parseFiles(
  items: (string | RawFileInput)[]
): ParsedFilesResult {
  const followers = new Set<string>();
  const following = new Set<string>();
  const extras: Partial<Record<ExtraCategoryKey, Set<string>>> = {};
  let sawFollowers = false;
  let sawFollowing = false;
  let hasValidJson = false;

  for (const item of items) {
    const text = typeof item === "string" ? item : item.text;
    const name = typeof item === "string" ? "" : (item.name ?? "");
    let data: unknown;
    try {
      data = JSON.parse(text);
      hasValidJson = true;
    } catch {
      continue;
    }
    const cat = detectCategory(data, name);
    if (!cat) continue;

    let usernames: Set<string>;
    try {
      usernames = parseUsernames(data);
    } catch {
      continue;
    }

    if (cat === "followers") {
      for (const u of usernames) followers.add(u);
      sawFollowers = true;
    } else if (cat === "following") {
      for (const u of usernames) following.add(u);
      sawFollowing = true;
    } else {
      if (!extras[cat]) extras[cat] = new Set<string>();
      const target = extras[cat]!;
      for (const u of usernames) target.add(u);
    }
  }

  if (!hasValidJson && items.length > 0) {
    throw new ParseError("invalid_json", "The file is not valid JSON.");
  }

  if (!sawFollowers || !sawFollowing) {
    throw new ParseError(
      "need_both",
      "Two kinds of files are required: followers_1.json and following.json."
    );
  }
  return { followers, following, extras };
}

export interface ApiPage {
  usernames: string[];
  nextMaxId: string | null;
}

/** Parse satu halaman respons endpoint friendships Instagram (followers atau following). */
export function parseApiPage(data: unknown): ApiPage {
  if (!data || typeof data !== "object") {
    throw new ParseError("bad_api", "Invalid Instagram response.");
  }
  const rec = data as Record<string, unknown>;
  if (!Array.isArray(rec.users)) {
    throw new ParseError("api_no_users", "Instagram response has no user list.");
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
    throw new ParseError("invalid_json", "The file is not valid JSON.");
  }
  return parseUsernames(data);
}
