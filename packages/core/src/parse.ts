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
  "following",
  "relationships_followers",
  "followers",
  "relationships_permanent_follow_requests",
  "relationships_persistent_follow_requests",
  "relationships_follow_requests_sent",
  "pending_follow_requests",
  "relationships_follow_requests_received",
  "recent_follow_requests",
  "relationships_unfollowed_users",
  "recently_unfollowed_profiles",
  "recently_unfollowed_accounts",
  "relationships_close_friends",
  "close_friends",
  "relationships_blocked_users",
  "blocked_profiles",
  "blocked_accounts",
  "relationships_restricted_users",
  "restricted_profiles",
  "restricted_accounts",
  "relationships_hide_stories_from",
  "relationships_hide_story_from",
  "hide_stories_from",
  "hide_story_from",
  "relationships_dismissed_suggested_users",
  "dismissed_suggested_users",
  "removed_suggestions",
  "suggested_users",
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

function usernameFromEntry(entry: Entry | unknown): string {
  if (typeof entry === "string") return normalizeUsername(entry);
  if (!entry || typeof entry !== "object") return "";

  const rec = entry as Record<string, unknown>;

  // 1. Direct label: "Username" dan value: "..."
  const directLabel = nonEmptyString(rec.label).toLowerCase();
  const directVal = nonEmptyString(rec.value);
  if (directLabel.includes("user") && directVal) {
    return normalizeUsername(directVal);
  }

  // 2. string_map_data (banyak digunakan di export Meta Accounts Center untuk pending requests, dismissed suggestions, dll.)
  if (rec.string_map_data && typeof rec.string_map_data === "object") {
    if (Array.isArray(rec.string_map_data)) {
      for (const item of rec.string_map_data) {
        if (item && typeof item === "object") {
          const itemRec = item as Record<string, unknown>;
          const lbl = nonEmptyString(itemRec.label).toLowerCase();
          const val = nonEmptyString(itemRec.value);
          if (lbl.includes("user") && val) return normalizeUsername(val);
          if (val && !val.includes(" ") && !val.includes("/")) return normalizeUsername(val);
          const href = nonEmptyString(itemRec.href);
          if (href) {
            const u = usernameFromHref(href);
            if (u) return normalizeUsername(u);
          }
        }
      }
    } else {
      const mapObj = rec.string_map_data as Record<string, unknown>;
      // Prioritas 1: cari key objek yang mengandung kata "user", "account", "profile"
      for (const [key, mapItem] of Object.entries(mapObj)) {
        const kLower = key.toLowerCase();
        if (kLower.includes("user") || kLower.includes("account") || kLower.includes("profile")) {
          if (mapItem && typeof mapItem === "object") {
            const mRec = mapItem as Record<string, unknown>;
            const val = nonEmptyString(mRec.value);
            if (val) return normalizeUsername(val);
            const href = nonEmptyString(mRec.href);
            if (href) {
              const u = usernameFromHref(href);
              if (u) return normalizeUsername(u);
            }
          } else if (typeof mapItem === "string" && mapItem && !mapItem.includes(" ") && !mapItem.includes("/")) {
            return normalizeUsername(mapItem);
          }
        }
      }
      // Prioritas 2: cek semua key lain di dalam string_map_data
      for (const [, mapItem] of Object.entries(mapObj)) {
        if (mapItem && typeof mapItem === "object") {
          const mRec = mapItem as Record<string, unknown>;
          const lbl = nonEmptyString(mRec.label).toLowerCase();
          const val = nonEmptyString(mRec.value);
          if (lbl.includes("user") && val) return normalizeUsername(val);
          if (val && !val.includes(" ") && !val.includes("/")) return normalizeUsername(val);
          const href = nonEmptyString(mRec.href);
          if (href) {
            const u = usernameFromHref(href);
            if (u) return normalizeUsername(u);
          }
        } else if (typeof mapItem === "string" && !mapItem.includes(" ") && !mapItem.includes("/")) {
          return normalizeUsername(mapItem);
        }
      }
    }
  }

  // 3. string_list_data (format followers_1.json, following.json, dll.)
  const items = Array.isArray(rec.string_list_data)
    ? (rec.string_list_data as StringListItem[])
    : [];
  for (const item of items) {
    if (item && typeof item === "object") {
      const itemRec = item as Record<string, unknown>;
      const lbl = nonEmptyString(itemRec.label).toLowerCase();
      const val = nonEmptyString(itemRec.value);
      if (lbl.includes("user") && val) return normalizeUsername(val);
      if (val && !val.includes(" ") && !val.includes("/")) return normalizeUsername(val);
      const href = nonEmptyString(itemRec.href);
      if (href) {
        const u = usernameFromHref(href);
        if (u) return normalizeUsername(u);
      }
    }
  }

  // 4. Title (khusus format following.json di mana title adalah username)
  const title = nonEmptyString(rec.title);
  if (title && !title.includes(" ") && !title.includes("/")) {
    return normalizeUsername(title);
  }

  // 5. Direct value jika ada dan bukan kalimat/frase panjang
  if (directVal && !directVal.includes(" ") && !directVal.includes("/")) {
    return normalizeUsername(directVal);
  }

  // 6. Direct username / name
  const u = nonEmptyString(rec.username);
  if (u) return normalizeUsername(u);

  const name = nonEmptyString(rec.name);
  if (name && !name.includes(" ") && !name.includes("/")) return normalizeUsername(name);

  // 7. Direct href
  const href = nonEmptyString(rec.href);
  if (href) {
    const fromHref = usernameFromHref(href);
    if (fromHref) return normalizeUsername(fromHref);
  }

  // 8. Fallback title
  if (title) return normalizeUsername(title);

  return "";
}

function extractEntries(data: unknown): Entry[] {
  if (Array.isArray(data)) return data as Entry[];
  if (data && typeof data === "object") {
    const rec = data as Record<string, unknown>;
    // Prioritaskan LIST_KEYS yang punya elemen
    for (const key of LIST_KEYS) {
      const list = rec[key];
      if (Array.isArray(list) && list.length > 0) return list as Entry[];
    }
    // Jika tidak ada yang length > 0, cek LIST_KEYS yang berupa array (meski kosong)
    for (const key of LIST_KEYS) {
      const list = rec[key];
      if (Array.isArray(list)) return list as Entry[];
    }
    // Cari semua array di dalam objek, prioritaskan yang tidak kosong dan bukan media_list_data
    const allArrays: Entry[][] = [];
    for (const key of Object.keys(rec)) {
      if (Array.isArray(rec[key])) {
        const arr = rec[key] as Entry[];
        if (arr.length > 0 && key !== "media_list_data") {
          return arr;
        }
        allArrays.push(arr);
      }
    }
    if (allArrays.length > 0) return allArrays[0];
    if (Object.keys(rec).length === 0) return [];
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
    if (!entry || (typeof entry !== "object" && typeof entry !== "string")) {
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
  if (
    fn.includes("pending_follow") ||
    fn.includes("pending_requests") ||
    fn.includes("pending_request") ||
    fn.includes("follow_requests_sent")
  ) {
    return "pendingRequests";
  }
  if (
    fn.includes("recently_unfollowed") ||
    fn.includes("unfollowed_accounts") ||
    fn.includes("unfollowed_users") ||
    fn.includes("unfollowed_profiles")
  ) {
    return "recentlyUnfollowed";
  }
  if (fn.includes("close_friends")) return "closeFriends";
  if (fn.includes("blocked")) return "blockedProfiles";
  if (fn.includes("restricted")) return "restrictedProfiles";
  if (fn.includes("hide_story") || fn.includes("hide_stories") || fn.includes("story_settings")) return "hideStoryFrom";
  if (fn.includes("recent_follow") || fn.includes("follow_requests_received")) return "recentRequests";
  if (
    fn.includes("removed_suggestions") ||
    fn.includes("dismissed_suggested") ||
    fn.includes("dismissed_suggestions") ||
    fn.includes("suggested_users")
  ) {
    return "removedSuggestions";
  }

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const rec = data as Record<string, unknown>;
    if (Array.isArray(rec.relationships_following) || Array.isArray(rec.following)) return "following";
    if (Array.isArray(rec.relationships_followers) || Array.isArray(rec.followers)) return "followers";
    if (
      Array.isArray(rec.relationships_permanent_follow_requests) ||
      Array.isArray(rec.relationships_persistent_follow_requests) ||
      Array.isArray(rec.relationships_follow_requests_sent) ||
      Array.isArray(rec.pending_follow_requests)
    ) {
      return "pendingRequests";
    }
    if (
      Array.isArray(rec.relationships_unfollowed_users) ||
      Array.isArray(rec.recently_unfollowed_profiles) ||
      Array.isArray(rec.recently_unfollowed_accounts)
    ) {
      return "recentlyUnfollowed";
    }
    if (Array.isArray(rec.relationships_close_friends) || Array.isArray(rec.close_friends)) return "closeFriends";
    if (Array.isArray(rec.relationships_blocked_users) || Array.isArray(rec.blocked_profiles) || Array.isArray(rec.blocked_accounts)) return "blockedProfiles";
    if (Array.isArray(rec.relationships_restricted_users) || Array.isArray(rec.restricted_profiles) || Array.isArray(rec.restricted_accounts)) return "restrictedProfiles";
    if (
      Array.isArray(rec.relationships_hide_stories_from) ||
      Array.isArray(rec.relationships_hide_story_from) ||
      Array.isArray(rec.hide_stories_from) ||
      Array.isArray(rec.hide_story_from)
    ) {
      return "hideStoryFrom";
    }
    if (Array.isArray(rec.relationships_follow_requests_received) || Array.isArray(rec.recent_follow_requests)) return "recentRequests";
    if (
      Array.isArray(rec.relationships_dismissed_suggested_users) ||
      Array.isArray(rec.dismissed_suggested_users) ||
      Array.isArray(rec.removed_suggestions)
    ) {
      return "removedSuggestions";
    }
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
