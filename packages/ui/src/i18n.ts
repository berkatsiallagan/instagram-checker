import type { ParseErrorCode } from "@follback/core";

export type Lang = "en" | "id";

export const LANGS: readonly Lang[] = ["id", "en"];

export interface Strings {
  title: string;
  subtitle: string;
  choose: string;
  dropHint: string;
  sample: string;
  demo: string;
  check: string;
  checking: string;
  tabNot: string;
  tabFans: string;
  tabMutual: string;
  search: string;
  profile: string;
  exportCsv: string;
  empty: string;
  privacy: string;
  warning: string;
  developedBy: string;
  language: string;
  errors: Record<ParseErrorCode, string>;
}

const en: Strings = {
  title: "Instagram Checker",
  subtitle:
    "A free tool to see who does not follow you back on Instagram. Private by design: everything runs in your browser.",
  choose: "Choose files",
  dropHint: "or drop followers_1.json and following.json here",
  sample: "Try sample data",
  demo: "Watch demo video",
  check: "Check",
  checking: "Checking",
  tabNot: "Not following back",
  tabFans: "Fans",
  tabMutual: "Mutual",
  search: "Search username",
  profile: "Open profile",
  exportCsv: "Export CSV",
  empty: "Nothing here.",
  privacy: "Everything runs in your browser. Your files never leave this device.",
  warning:
    "Reading directly from Instagram may get your account rate limited. Use at your own risk.",
  developedBy: "Developed by",
  language: "Language",
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
  dropHint: "atau taruh followers_1.json dan following.json di sini",
  sample: "Coba data contoh",
  demo: "Tonton video demo",
  check: "Cek",
  checking: "Memeriksa",
  tabNot: "Tidak follback",
  tabFans: "Fans",
  tabMutual: "Mutual",
  search: "Cari username",
  profile: "Buka profil",
  exportCsv: "Ekspor CSV",
  empty: "Tidak ada data.",
  privacy:
    "Semua berjalan di browser kamu. File tidak pernah keluar dari perangkat ini.",
  warning:
    "Membaca langsung dari Instagram bisa membuat akunmu kena pembatasan. Risiko ditanggung sendiri.",
  developedBy: "Dikembangkan oleh",
  language: "Bahasa",
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
