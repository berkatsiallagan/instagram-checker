export type Lang = "en" | "id";

export interface Strings {
  title: string;
  drop: string;
  sample: string;
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
  needBoth: string;
  clear: string;
}

const en: Strings = {
  title: "Follback Checker",
  drop: "Drop followers_1.json and following.json here, or click to choose files",
  sample: "Use sample data",
  check: "Check",
  checking: "Checking",
  tabNot: "Not following back",
  tabFans: "Fans",
  tabMutual: "Mutual",
  search: "Search username",
  profile: "profile",
  exportCsv: "Export CSV",
  empty: "Nothing here.",
  privacy:
    "Everything runs in your browser. Your files never leave this device.",
  warning:
    "Reading directly from Instagram may get your account rate limited. Use at your own risk.",
  needBoth: "Choose both followers and following files.",
  clear: "Clear",
};

const id: Strings = {
  title: "Follback Checker",
  drop: "Taruh followers_1.json dan following.json di sini, atau klik untuk memilih file",
  sample: "Pakai data contoh",
  check: "Cek",
  checking: "Memeriksa",
  tabNot: "Tidak follback",
  tabFans: "Fans",
  tabMutual: "Mutual",
  search: "Cari username",
  profile: "profil",
  exportCsv: "Ekspor CSV",
  empty: "Tidak ada data.",
  privacy:
    "Semua berjalan di browser kamu. File tidak pernah keluar dari perangkat ini.",
  warning:
    "Membaca langsung dari Instagram bisa membuat akunmu kena pembatasan. Risiko ditanggung sendiri.",
  needBoth: "Pilih file followers dan following sekaligus.",
  clear: "Hapus",
};

export function detectLang(nav: { language?: string } = navigator): Lang {
  return (nav.language ?? "en").toLowerCase().startsWith("id") ? "id" : "en";
}

export function strings(lang: Lang): Strings {
  return lang === "id" ? id : en;
}
