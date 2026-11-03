export type Lang = "en" | "id";

export interface Strings {
  title: string;
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
}

const en: Strings = {
  title: "Follback Checker",
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
};

const id: Strings = {
  title: "Follback Checker",
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
};

export function detectLang(nav: { language?: string } = navigator): Lang {
  return (nav.language ?? "en").toLowerCase().startsWith("id") ? "id" : "en";
}

export function strings(lang: Lang): Strings {
  return lang === "id" ? id : en;
}
