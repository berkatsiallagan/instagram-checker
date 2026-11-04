import type { ParseErrorCode } from "@follback/core";

export type Lang = "en" | "id";

export const LANGS: readonly Lang[] = ["id", "en"];

export interface GuideStep {
  title: string;
  desc: string;
}

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
  legalPrivacy: string;
  legalTerms: string;
  warning: string;
  tabTip: string;
  extensionBannerPrefix: string;
  extensionDownloadText: string;
  extensionBannerSuffix: string;
  extInstallGuideTitle: string;
  extInstallSteps: string[];
  pwaInstall: string;
  pwaInstallTitle: string;
  pwaInstallGuideIos: string;
  pwaInstallGuideAndroid: string;
  developedBy: string;
  language: string;
  guideTitle: string;
  guideSteps: GuideStep[];
  guideNote: string;
  hideUnfollowed: string;
  copyUsernames: string;
  copiedUsernames: string;
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
  legalPrivacy: "Privacy Policy",
  legalTerms: "Terms of Service",
  warning:
    "Reading directly from Instagram may get your account rate limited. Use at your own risk.",
  tabTip:
    "Tip: Click 'New Tab' at the top bar if you want the check to run in a full browser tab without closing when clicking outside.",
  extensionBannerPrefix: "Prefer not to download JSON files? You can",
  extensionDownloadText: "Download our Chrome Extension",
  extensionBannerSuffix: "to check directly in your browser with 1 click.",
  extInstallGuideTitle: "How to install the extension in your browser",
  extInstallSteps: [
    "Download and extract the ZIP file to a folder on your computer.",
    "Open chrome://extensions (or edge://extensions) in your browser and enable Developer mode in the top right.",
    "Click Load unpacked and select the extracted folder.",
    "Make sure instagram.com is open in another tab, then click the extension icon to start.",
  ],
  pwaInstall: "Install App",
  pwaInstallTitle: "Install Instagram Checker as an application on your device",
  pwaInstallGuideIos: "To install: tap the Share button in Safari, then select 'Add to Home Screen'.",
  pwaInstallGuideAndroid: "To install: open the browser menu (three dots) and tap 'Install app' or 'Add to Home screen'.",
  developedBy: "Developed by",
  language: "Language",
  guideTitle: "How to get your Instagram JSON files",
  guideSteps: [
    {
      title: "Open Settings Menu",
      desc: "Go to your Instagram profile, tap the menu icon (three lines) in the top right, and choose Settings and activity. Select Meta Account, then go to Your information and permissions. Tap Export your information, then select Create export.",
    },
    {
      title: "Choose Profile and Destination",
      desc: "Select your Instagram account from the list. Choose Export to device to save the file to your phone or computer.",
    },
    {
      title: "Customize Data to Export",
      desc: "On the confirmation screen, tap Customise information. Uncheck all options, then check ONLY 'Followers and following'. Tap Save. (Optional) Set Date range to All time, choose JSON format, and set Media quality to Lower quality for faster processing.",
    },
    {
      title: "Start Export and Verify",
      desc: "Tap Start export at the bottom. Enter your account password for security verification, then tap Continue.",
    },
    {
      title: "Wait and Download File",
      desc: "You will receive an email that the export is in progress. Wait until you get the second email saying your file is ready (usually a few minutes). Go back to Export your information, find your file under Available downloads, and tap Download. Tap Download again to save it to your device.",
    },
    {
      title: "Access Your Files",
      desc: "The file downloads as a ZIP archive. Open it using a file manager on your phone or extract it on your computer. Inside, open connections > followers_and_following which contains your full follower and following data.",
    },
  ],
  guideNote:
    "Note: If an account shows 'Something went wrong' on Instagram, the account has been deactivated, deleted, or suspended. Meta still retains old friendships in following.json, which is why they appear under Not following back.",
  hideUnfollowed: "Hide unfollowed",
  copyUsernames: "Copy usernames",
  copiedUsernames: "Copied!",
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
  legalPrivacy: "Kebijakan Privasi",
  legalTerms: "Syarat & Ketentuan",
  warning:
    "Membaca langsung dari Instagram bisa membuat akunmu kena pembatasan. Risiko ditanggung sendiri.",
  tabTip:
    "Tips: Klik 'Tab Baru' di kanan atas jika ingin mengecek di tab browser penuh agar tidak tertutup saat mengklik di luar jendela.",
  extensionBannerPrefix: "Tidak mau repot mengunduh file JSON?",
  extensionDownloadText: "Unduh Ekstensi Chrome",
  extensionBannerSuffix: "untuk cek langsung dari peramban dalam 1 klik.",
  extInstallGuideTitle: "Cara pasang ekstensi di browser (Chrome / Edge / Brave)",
  extInstallSteps: [
    "Unduh dan ekstrak file ZIP ke salah satu folder di komputermu.",
    "Buka chrome://extensions (atau edge://extensions) di peramban dan aktifkan Developer mode di kanan atas.",
    "Klik Load unpacked (Muat yang belum dibongkar) lalu pilih folder hasil ekstrak tadi.",
    "Pastikan tab instagram.com terbuka di tab lain, lalu klik ikon ekstensi untuk mulai.",
  ],
  pwaInstall: "Pasang Aplikasi",
  pwaInstallTitle: "Pasang Instagram Checker sebagai aplikasi di perangkat Anda",
  pwaInstallGuideIos: "Untuk memasang: ketuk tombol Bagikan (Share) di Safari, lalu pilih 'Tambahkan ke Layar Utama'.",
  pwaInstallGuideAndroid: "Untuk memasang: buka menu peramban (titik tiga) lalu pilih 'Pasang Aplikasi' atau 'Tambahkan ke Layar Utama'.",
  developedBy: "Dikembangkan oleh",
  language: "Bahasa",
  guideTitle: "Cara mendapatkan file JSON dari Instagram",
  guideSteps: [
    {
      title: "Buka Menu Pengaturan",
      desc: "Masuk ke profil Instagram Anda, ketuk ikon menu (tiga garis) di kanan atas, lalu pilih Settings and activity. Pilih Meta Account (Akun Meta), lalu masuk ke Your information and permissions (Informasi dan izin Anda). Ketuk Export your information (Ekspor informasi Anda), lalu pilih Create export (Buat ekspor).",
    },
    {
      title: "Pilih Profil dan Tujuan",
      desc: "Pilih akun Instagram Anda dari daftar profil. Pilih Export to device (Ekspor ke perangkat) untuk menyimpan file di HP/komputer Anda.",
    },
    {
      title: "Atur Data yang Diekspor (Kustomisasi)",
      desc: "Pada halaman konfirmasi, ketuk Customise information (Kustomisasi informasi). Hapus centang pada semua opsi, lalu centang hanya pada 'Followers and following'. Ketuk Save. (Opsional) Atur Date range ke All time (Sepanjang waktu), pilih Format JSON, dan atur Media quality ke Lower quality (agar proses lebih cepat).",
    },
    {
      title: "Mulai Ekspor dan Verifikasi",
      desc: "Ketuk Start export di bagian bawah. Masukkan password akun Anda untuk verifikasi keamanan, lalu ketuk Continue.",
    },
    {
      title: "Tunggu dan Unduh File",
      desc: "Anda akan menerima email pemberitahuan bahwa proses sedang berjalan. Tunggu hingga Anda menerima email kedua yang menyatakan file sudah siap (biasanya hanya butuh beberapa menit). Buka kembali halaman Export your information, lalu pada bagian Available downloads, ketuk Download. Ketuk Download sekali lagi pada file yang muncul di layar untuk menyimpannya ke perangkat.",
    },
    {
      title: "Akses File",
      desc: "File akan terunduh dalam format JSON (bukan gambar/dokumen biasa). Buka file tersebut menggunakan aplikasi file manager di HP atau ekstrak di komputer. Di dalamnya, Anda akan menemukan folder connections > followers_and_following yang berisi data lengkap daftar pengikut dan akun yang Anda ikuti.",
    },
  ],
  guideNote:
    "Catatan: Jika akun bertuliskan 'Something went wrong', akun tersebut telah dinonaktifkan, dihapus, atau dibanned. Meta tetap menyimpan relasi lama di following.json sehingga mereka terdeteksi di daftar Tidak follback.",
  hideUnfollowed: "Sembunyikan unfollowed",
  copyUsernames: "Salin username",
  copiedUsernames: "Tersalin!",
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
