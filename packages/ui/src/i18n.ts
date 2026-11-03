import type { ParseErrorCode } from "@follback/core";

export type Lang = "en" | "id";

export const LANGS: readonly Lang[] = ["id", "en"];

export interface Strings {
  title: string;
  subtitle: string;
  choose: string;
  chooseFolder: string;
  dropHint: string;
  demo: string;
  check: string;
  checking: string;
  tabNot: string;
  tabFans: string;
  tabMutual: string;
  tabPendingRequests: string;
  tabRecentlyUnfollowed: string;
  tabCloseFriends: string;
  tabBlockedProfiles: string;
  tabRestrictedProfiles: string;
  tabHideStoryFrom: string;
  tabRecentRequests: string;
  tabRemovedSuggestions: string;
  search: string;
  profile: string;
  actionUnfollow: string;
  exportCsv: string;
  resetData: string;
  confirmReset: string;
  empty: string;
  privacy: string;
  warning: string;
  developedBy: string;
  language: string;
  guideTitle: string;
  guideStep1: string;
  guideStep2: string;
  guideStep3: string;
  guideNote: string;
  confirmUnfollow: string;
  unfollowedBadge: string;
  confirmFollow: string;
  followedBadge: string;
  sortDefault: string;
  sortAz: string;
  sortZa: string;
  statsFollowing: string;
  statsFollowers: string;
  statsNotFollback: string;
  statsFans: string;
  statsMutual: string;
  statsRate: string;
  historyTitle: string;
  historyNewUnfollowers: string;
  historyNone: string;
  historySaved: string;
  historyClear: string;
  errors: Record<ParseErrorCode, string>;
}

const en: Strings = {
  title: "Instagram Checker",
  subtitle:
    "A free tool to see who does not follow you back on Instagram. Private by design: everything runs in your browser.",
  choose: "Choose files",
  chooseFolder: "Choose folder",
  dropHint: "or drop followers_and_following folder or files here",
  demo: "Watch demo video",
  check: "Check",
  checking: "Checking",
  tabNot: "Not following back",
  tabFans: "Fans",
  tabMutual: "Mutual",
  tabPendingRequests: "Pending requests",
  tabRecentlyUnfollowed: "Recently unfollowed",
  tabCloseFriends: "Close friends",
  tabBlockedProfiles: "Blocked",
  tabRestrictedProfiles: "Restricted",
  tabHideStoryFrom: "Hide story from",
  tabRecentRequests: "Recent requests",
  tabRemovedSuggestions: "Dismissed suggestions",
  search: "Search username",
  profile: "Open profile",
  actionUnfollow: "Unfollow",
  exportCsv: "Export CSV",
  resetData: "Clear saved data",
  confirmReset: "Clear all saved analysis and unfollow progress?",
  empty: "Nothing here.",
  privacy: "Runs in your browser. Files never leave your device.",
  warning:
    "Reading directly from Instagram may get your account rate limited. Use at your own risk.",
  developedBy: "Developed by",
  language: "Language",
  guideTitle: "How to get your Instagram JSON files",
  guideStep1:
    "In Instagram, open Settings > Accounts Center > Your information and permissions > Download your information.",
  guideStep2:
    "Select Some of your information, check Followers and following, and choose JSON format.",
  guideStep3:
    "Once the file is ready, download and extract the zip archive. Drag followers_1.json and following.json here.",
  guideNote:
    "Note: If an account shows 'Something went wrong' on Instagram, the account has been deactivated, deleted, or suspended. Meta still retains old friendships in following.json, which is why they appear under Not following back.",
  confirmUnfollow: "Mark as unfollowed?",
  unfollowedBadge: "Unfollowed",
  confirmFollow: "Mark as followed?",
  followedBadge: "Followed",
  sortDefault: "Default order",
  sortAz: "Username (A - Z)",
  sortZa: "Username (Z - A)",
  statsFollowing: "Following",
  statsFollowers: "Followers",
  statsNotFollback: "Not following back",
  statsFans: "Fans",
  statsMutual: "Mutual",
  statsRate: "Followback rate",
  historyTitle: "Local comparison history",
  historyNewUnfollowers: "New unfollowers since last check",
  historyNone: "No new unfollowers detected since last check.",
  historySaved: "Last check saved in your browser.",
  historyClear: "Clear history",
  errors: {
    unknown_format:
      "Unrecognized JSON format. Use followers_1.json or following.json from the Instagram export.",
    invalid_json: "The file is not valid JSON.",
    bad_entry: "An entry in the JSON file is not an object.",
    need_both: "Both files are required: followers_1.json and following.json.",
    bad_api: "Invalid response from Instagram.",
    api_no_users: "Instagram response has no user list.",
  },
};

const id: Strings = {
  title: "Instagram Checker",
  subtitle:
    "Alat gratis untuk melihat siapa yang tidak follow kamu balik di Instagram. Privat dari awal: semuanya berjalan di browser kamu.",
  choose: "Pilih file",
  chooseFolder: "Pilih folder",
  dropHint: "atau taruh folder atau file followers_and_following di sini",
  demo: "Tonton video demo",
  check: "Cek",
  checking: "Memeriksa",
  tabNot: "Tidak follback",
  tabFans: "Fans",
  tabMutual: "Mutual",
  tabPendingRequests: "Permintaan tertunda",
  tabRecentlyUnfollowed: "Baru di-unfollow",
  tabCloseFriends: "Teman dekat",
  tabBlockedProfiles: "Diblokir",
  tabRestrictedProfiles: "Dibatasi",
  tabHideStoryFrom: "Sembunyikan cerita",
  tabRecentRequests: "Permintaan baru",
  tabRemovedSuggestions: "Saran dihapus",
  search: "Cari username",
  profile: "Buka profil",
  actionUnfollow: "Unfollow",
  exportCsv: "Ekspor CSV",
  resetData: "Hapus data tersimpan",
  confirmReset: "Hapus semua data analisis dan progres unfollow yang tersimpan?",
  empty: "Tidak ada data.",
  privacy: "Privat di browsermu. File tidak keluar dari perangkat.",
  warning:
    "Membaca langsung dari Instagram bisa membuat akunmu kena pembatasan. Risiko ditanggung sendiri.",
  developedBy: "Dikembangkan oleh",
  language: "Bahasa",
  guideTitle: "Cara mendapatkan file JSON dari Instagram",
  guideStep1:
    "Di Instagram, buka Pengaturan > Pusat Akun > Informasi dan izin Anda > Unduh informasi Anda.",
  guideStep2:
    "Pilih Beberapa informasi Anda, centang Pengikut dan mengikuti (Followers & following), lalu pilih format JSON.",
  guideStep3:
    "Setelah file siap, unduh dan ekstrak arsip zip. Masukkan file followers_1.json dan following.json ke sini.",
  guideNote:
    "Catatan: Jika akun bertuliskan 'Something went wrong', akun tersebut telah dinonaktifkan, dihapus, atau dibanned. Meta tetap menyimpan relasi lama di following.json sehingga mereka terdeteksi di daftar Tidak follback.",
  confirmUnfollow: "Tandai sudah unfollow?",
  unfollowedBadge: "Sudah di-unfollow",
  confirmFollow: "Tandai sudah follow?",
  followedBadge: "Sudah di-follow",
  sortDefault: "Urutan default",
  sortAz: "Username (A - Z)",
  sortZa: "Username (Z - A)",
  statsFollowing: "Mengikuti",
  statsFollowers: "Pengikut",
  statsNotFollback: "Tidak follback",
  statsFans: "Fans",
  statsMutual: "Mutual",
  statsRate: "Rasio follback",
  historyTitle: "Riwayat perbandingan lokal",
  historyNewUnfollowers: "Unfollower baru sejak cek terakhir",
  historyNone: "Tidak ada unfollower baru sejak pengecekan terakhir.",
  historySaved: "Cek terakhir tersimpan di browser.",
  historyClear: "Hapus riwayat",
  errors: {
    unknown_format:
      "Format JSON tidak dikenal. Pakai followers_1.json atau following.json dari export Instagram.",
    invalid_json: "File bukan JSON yang valid.",
    bad_entry: "Ada entri yang bukan objek di dalam file JSON.",
    need_both: "Butuh kedua file: followers_1.json dan following.json.",
    bad_api: "Respons Instagram tidak valid.",
    api_no_users: "Respons Instagram tidak berisi daftar pengguna.",
  },
};

const LANG_KEY = "instagram-checker-lang";

export function detectLang(nav: { language?: string } = navigator): Lang {
  return (nav.language ?? "en").toLowerCase().startsWith("id") ? "id" : "en";
}

/** Bahasa pilihan pengguna (tersimpan lokal), atau ikut bahasa browser. */
export function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "id" || saved === "en") return saved;
  } catch {
    // localStorage bisa diblokir; abaikan.
  }
  return detectLang();
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // abaikan
  }
}

export function strings(lang: Lang): Strings {
  return lang === "id" ? id : en;
}
