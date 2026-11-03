<div align="center">

# Instagram Checker

Find out who does not follow you back on Instagram, right on your device.<br>
Cek siapa yang tidak follow balik di Instagram, langsung di perangkatmu.

[![Live App](https://img.shields.io/badge/website-ig.berkatsiallagan.com-1a3a6b?style=flat-square)](https://ig.berkatsiallagan.com/)
[![License: MIT](https://img.shields.io/github/license/berkatsiallagan/instagram-checker?style=flat-square&color=1a3a6b)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-34%20passing-1a3a6b?style=flat-square)](tests/slop.test.ts)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-1a3a6b?style=flat-square)](packages/core)
[![Release](https://img.shields.io/badge/release-v0.2.2-1a3a6b?style=flat-square)](https://github.com/berkatsiallagan/instagram-checker/releases)
[![Privacy](https://img.shields.io/badge/data-100%25%20client--side-1a3a6b?style=flat-square)](PRIVACY.md)

No server, no account, no tracking. / Tanpa server, tanpa akun, tanpa pelacak.

**[Try the Web App](https://ig.berkatsiallagan.com/)** | **[Coba Versi Web](https://ig.berkatsiallagan.com/)**

</div>

---

<details open>
<summary><b>English</b></summary>

## About

Instagram Checker compares your Instagram followers and following lists and shows three things: who does not follow you back, who follows you but you do not follow back, and who follows each other with you.

It comes in two forms that share one core logic:

| Form | How it works | Best for |
|---|---|---|
| **Website** | Drag and drop the JSON files from Instagram's official data export | Anyone, nothing to install |
| **Browser extension** | One button, reads data through your own logged-in session | Quick checks without downloading an export |

All processing happens in the browser. No data is sent to any server.

## Features

- **Full Relationship Categories:** Displays **Not following back**, **Fans**, **Mutual**, and all 8 Meta connection categories (*Pending requests*, *Recently unfollowed*, *Close friends*, *Blocked*, *Restricted*, *Hide story from*, *Recent requests*, *Dismissed suggestions*).
- **Interactive Metric Cards:** Click any statistic card to switch directly to that category tab.
- **Instant Unfollow Workflow:** One-click instant unfollow button on the *Not following back* tab that opens the profile and marks it as unfollowed with strikethrough.
- **Hide Unfollowed Filter:** Toggle checkbox to instantly hide accounts you've already unfollowed for clean progress tracking.
- **Copy to Clipboard:** Copy filtered or full username lists directly with a single click.
- **Local Persistence & Privacy:** Analysis state and unfollow progress are automatically restored on next visit via `localStorage`. Never leaves your device.
- **Hybrid Upload:** Drop single JSON files or the whole `followers_and_following` export folder directly.
- **CSV Export:** Clean CSV download protected against spreadsheet formula injection.

## Usage

### Website (How to export and use JSON)

1. **Open Settings Menu**
   Go to your Instagram profile, tap the menu icon (three lines) in the top right, and choose **Settings and activity**. Select **Meta Account**, then go to **Your information and permissions**. Tap **Export your information**, then select **Create export**.
2. **Choose Profile and Destination**
   Select your Instagram account from the list. Choose **Export to device** to save the file to your phone or computer.
3. **Customize Data to Export**
   On the confirmation screen, tap **Customise information**. Uncheck all options, then check ONLY **"Followers and following"**. Tap **Save**. *(Optional)* Set **Date range** to **All time**, choose **Format JSON**, and set **Media quality** to **Lower quality** for faster processing.
4. **Start Export and Verify**
   Tap **Start export** at the bottom. Enter your account password for security verification, then tap **Continue**.
5. **Wait and Download File**
   You will receive an email that the export is in progress. Wait until you get the second email saying your file is ready (usually a few minutes). Go back to *Export your information*, find your file under **Available downloads**, and tap **Download**. Tap **Download** again to save it to your device.
6. **Access Your Files**
   The file downloads as a ZIP archive. Open it using a file manager on your phone or extract it on your computer. Drag the `followers_and_following` folder or `followers_1.json` and `following.json` into the upload zone on the website.

### Extension (Manual Install from GitHub Releases)

1. Download `instagram-checker-chrome.zip` (for Chrome/Edge/Brave) or `instagram-checker-firefox.zip` from [GitHub Releases](https://github.com/berkatsiallagan/instagram-checker/releases).
2. Extract the ZIP file.
3. In Chrome/Edge/Brave, go to `chrome://extensions` and enable **Developer mode** in the top right.
4. Click **Load unpacked** and select the extracted folder.

## Privacy

- No backend, database, account, or analytics.
- Files are read in the browser and kept in memory only.
- The website uses a Content Security Policy that blocks outgoing connections.
- The extension only talks to `instagram.com`, and only when you press the button.
- All code is open, and the core has no third-party runtime dependencies.

More details in [PRIVACY.md](PRIVACY.md).

## Architecture

```
.
├── packages/
│   └── core/          Parser, diff, and CSV export (plain TypeScript)
├── apps/
│   ├── web/           Static website (Next.js static export)
│   └── extension/     Manifest V3 extension
└── PRIVACY.md
```

```mermaid
flowchart LR
  A["JSON file or IG session"] --> B["parse"]
  B --> C["diff"]
  C --> D["Result view"]
  C --> E["CSV export"]
```

## Development

Requirements: Node.js 20 or newer.

```bash
git clone https://github.com/berkatsiallagan/instagram-checker.git
cd instagram-checker
npm install
npm test
```

```ts
import { parseText, diff } from "@follback/core";

const followers = parseText(followersJsonText);
const following = parseText(followingJsonText);

const { notFollowingBack, fans, mutual } = diff(followers, following);
```

## Status

| Component | Status |
|---|---|
| Core (parser, diff, CSV) and tests | Done (100% test coverage) |
| Shared UI and website | Live on [ig.berkatsiallagan.com](https://ig.berkatsiallagan.com/) |
| Extension | Built (v0.2.2 available on GitHub Releases) |

## Roadmap

- [x] Core parser, diff, and CSV export
- [x] Shared UI with dual language (ID/EN) and 6-step export guide
- [x] Static website on Cloudflare Pages
- [x] Extension, JSON mode
- [x] Extension, direct read from logged-in session
- [x] Release v0.2.2 on GitHub Releases (Chrome and Firefox zip)
- [ ] Publish to Microsoft Edge Add-ons and Firefox Add-ons

## Contributing

Issues and pull requests are welcome. For large changes, open an issue first. Make sure `npm test` passes before sending a PR. Translations are also welcome.

## Disclaimer

This project is not affiliated with Instagram or Meta. Use it according to Instagram's terms of service and at your own responsibility.

</details>

<details>
<summary><b>Bahasa Indonesia</b></summary>

## Tentang

Instagram Checker membandingkan daftar followers dan following Instagram milikmu, lalu menampilkan tiga hal: siapa yang tidak follow balik, siapa yang follow kamu tapi belum kamu follow, dan siapa yang saling follow.

Proyek ini punya dua bentuk yang memakai satu core logic yang sama:

| Bentuk | Cara kerja | Cocok untuk |
|---|---|---|
| **Website** | Drag-drop file JSON dari export resmi Instagram | Siapa saja, tanpa memasang apa pun |
| **Extension browser** | Satu tombol, membaca data lewat sesi login milikmu | Pengecekan cepat tanpa mengunduh export |

Semua pemrosesan terjadi di browser. Tidak ada data yang dikirim ke server mana pun.

## Fitur

- **Kategori Relasi Lengkap:** Menampilkan **Tidak follback**, **Fans**, **Mutual**, dan 8 kategori file koneksi Meta (*Permintaan tertunda*, *Baru di-unfollow*, *Teman dekat*, *Diblokir*, *Dibatasi*, *Sembunyikan cerita*, *Permintaan baru*, *Saran dihapus*).
- **Kartu Statistik Interaktif:** Klik kartu metrik apa saja untuk langsung beralih ke tab kategori tersebut.
- **Unfollow Instan:** Tombol satu kali klik di tab *Tidak follback* yang langsung membuka profil akun dan menandai status sudah di-unfollow.
- **Sembunyikan Akun Unfollowed:** Toggle centang untuk menyembunyikan akun yang sudah di-unfollow agar daftar tetap rapi dan fokus ke sisa akun.
- **Salin Daftar Username:** Salin daftar username aktif langsung ke clipboard dalam satu klik.
- **Penyimpanan Lokal & Privat:** Hasil analisis dan status unfollow otomatis tersimpan di `localStorage` peramban. Nol data keluar dari perangkatmu.
- **Unggah Hybrid:** Dukung unggah file satuan maupun langsung satu folder `followers_and_following`.
- **Ekspor CSV:** Ekspor data aman dengan sanitasi pencegahan formula injection di Excel/Sheets.

## Cara Pakai

### Website (Panduan Ekspor dan Pakai JSON)

1. **Buka Menu Pengaturan**
   Masuk ke profil Instagram Anda, ketuk ikon menu (tiga garis) di kanan atas, lalu pilih **Settings and activity**. Pilih **Meta Account** (Akun Meta), lalu masuk ke **Your information and permissions** (Informasi dan izin Anda). Ketuk **Export your information** (Ekspor informasi Anda), lalu pilih **Create export** (Buat ekspor).
2. **Pilih Profil dan Tujuan**
   Pilih akun Instagram Anda dari daftar profil. Pilih **Export to device** (Ekspor ke perangkat) untuk menyimpan file di HP/komputer Anda.
3. **Atur Data yang Diekspor (Kustomisasi)**
   Pada halaman konfirmasi, ketuk **Customise information** (Kustomisasi informasi). Hapus centang pada semua opsi, lalu **centang hanya pada "Followers and following"**. Ketuk **Save**. *(Opsional)* Atur **Date range** ke **All time** (Sepanjang waktu), pilih **Format JSON**, dan atur **Media quality** ke **Lower quality** (agar proses lebih cepat).
4. **Mulai Ekspor dan Verifikasi**
   Ketuk **Start export** di bagian bawah. Masukkan **password** akun Anda untuk verifikasi keamanan, lalu ketuk **Continue**.
5. **Tunggu dan Unduh File**
   Anda akan menerima email pemberitahuan bahwa proses sedang berjalan. Tunggu hingga Anda menerima email kedua yang menyatakan file **sudah siap** (biasanya hanya butuh beberapa menit). Buka kembali halaman *Export your information*, lalu pada bagian **Available downloads**, ketuk **Download**. Ketuk **Download** sekali lagi pada file yang muncul di layar untuk menyimpannya ke perangkat.
6. **Akses File**
   File akan terunduh dalam format ZIP/JSON. Buka file tersebut menggunakan aplikasi *file manager* di HP atau ekstrak di komputer. Tarik folder `followers_and_following` atau file `followers_1.json` dan `following.json` ke kotak di website.

### Extension (Pemasangan Manual dari GitHub Releases)

1. Unduh file `instagram-checker-chrome.zip` (untuk Chrome/Edge/Brave) atau `instagram-checker-firefox.zip` dari [GitHub Releases](https://github.com/berkatsiallagan/instagram-checker/releases).
2. Ekstrak file ZIP tersebut ke sebuah folder.
3. Di browser Chrome/Edge/Brave, buka `chrome://extensions` dan aktifkan **Developer mode** di pojok kanan atas.
4. Klik **Load unpacked** dan pilih folder hasil ekstrak tadi.

## Privasi

- Tidak ada backend, database, akun, atau analytics.
- File dibaca di browser dan hanya disimpan di memori.
- Website memakai Content Security Policy yang memblokir koneksi keluar.
- Extension hanya berbicara dengan `instagram.com`, dan hanya saat kamu menekan tombol.
- Seluruh kode terbuka dan tidak ada dependency runtime pihak ketiga di core.

Selengkapnya ada di [PRIVACY.md](PRIVACY.md).

## Arsitektur

Struktur repo dan alur data sama dengan versi English di atas. Core tidak punya dependency runtime dan tidak melakukan I/O, sehingga mudah diuji dan dipakai ulang oleh website maupun extension.

## Pengembangan

Prasyarat: Node.js 20 atau lebih baru.

```bash
git clone https://github.com/berkatsiallagan/instagram-checker.git
cd instagram-checker
npm install
npm test
```

## Status

| Komponen | Status |
|---|---|
| Core (parser, diff, CSV) dan test | Selesai (100% lolos tes) |
| UI bersama dan website | Aktif di [ig.berkatsiallagan.com](https://ig.berkatsiallagan.com/) |
| Extension | Selesai di-bundle (v0.2.2 tersedia di GitHub Releases) |

## Roadmap

- [x] Core parser, diff, dan ekspor CSV
- [x] UI bersama dengan dual bahasa (ID/EN) dan panduan 6 langkah
- [x] Website statis di Cloudflare Pages
- [x] Extension mode JSON
- [x] Extension mode baca langsung dari sesi login
- [x] Rilis v0.2.2 di GitHub Releases (arsip zip Chrome & Firefox)
- [ ] Rilis di Microsoft Edge Add-ons dan Firefox Add-ons

## Kontribusi

Issue dan pull request diterima. Untuk perubahan besar, buka issue dulu. Pastikan `npm test` lolos sebelum mengirim PR. Terjemahan ke bahasa lain juga diterima.

## Disclaimer

Proyek ini tidak berafiliasi dengan Instagram atau Meta. Gunakan sesuai ketentuan layanan Instagram dan tanggung jawab sendiri.

</details>

---

<div align="center">

Icons: [Google Material Symbols](https://fonts.google.com/icons) (Apache 2.0), inlined as SVG so the app makes no external requests.

[MIT](LICENSE) &copy; 2026 [Berkat Tua Siallagan](https://berkatsiallagan.com)

</div>
