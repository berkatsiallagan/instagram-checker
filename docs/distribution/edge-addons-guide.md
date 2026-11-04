# Panduan Publikasi ke Microsoft Edge Add-ons

Microsoft Edge Add-ons adalah toko ekstensi resmi untuk peramban Microsoft Edge (bawaan Windows 10 & 11). Pendaftaran akun pengembang di sini adalah **100% GRATIS (Rp0)** tanpa biaya registrasi seperti Chrome Web Store.

---

## 1. Siapkan Berkas Paket & Aset
Semua berkas yang dibutuhkan sudah disiapkan di repository:
- **Paket ZIP Ekstensi**:
  Gunakan file `instagram-checker-chrome.zip` (atau zip dari folder `apps/extension/dist/chrome`).
- **Aset Gambar** (tersimpan di folder `apps/extension/store-assets/`):
  1. `icon-128.png` (Ikon Toko 128x128)
  2. `promo-440x280.png` (Small Promotional Tile 440x280)
  3. `screenshot-1280x800.png` (Tangkapan Layar Toko 1280x800)
- **Teks Deskripsi & Metadata**:
  Buka file `docs/distribution/store-listing.md`.

---

## 2. Langkah Pendaftaran Akun Pengembang
1. Buka portal **Microsoft Partner Center**:
   https://partner.microsoft.com/dashboard/microsoftedge
2. Masuk menggunakan akun Microsoft pribadi (Outlook, Hotmail, atau akun kerja/sekolah).
3. Isi informasi dasar pengembang:
   - Nama Pengembang (Developer Name / Publisher Name): Contoh: `Berkat Tua Siallagan`
   - Email kontak
   - Setujui perjanjian pengembang Microsoft.
4. Akun langsung aktif seketika tanpa perlu bayar sepeser pun.

---

## 3. Langkah Pengiriman Ekstensi Baru
1. Di halaman dashboard Microsoft Partner Center, klik tombol **Create new extension** (Buat ekstensi baru).
2. **Unggah Paket**:
   - Tarik dan letakkan file `instagram-checker-chrome.zip` (atau `apps/extension/dist/chrome`).
   - Sistem akan memvalidasi file `manifest.json`.
3. **Isi Properti & Kategori**:
   - Primary Category: Pilih **Social** atau **Productivity**.
   - Developer contact: Masukkan email Anda.
   - Privacy Policy URL: `https://ig.berkatsiallagan.com/privacy`
   - Terms of Service URL: `https://ig.berkatsiallagan.com/terms`
   - Support URL: `https://github.com/berkatsiallagan/instagram-checker/issues`
4. **Isi Detail Listing (Deskripsi & Aset)**:
   - Pilih Bahasa utama (English / Indonesian).
   - Masukkan **Title**, **Short description**, dan **Detailed description** dari file `docs/distribution/store-listing.md`.
   - Unggah **Logo**: `apps/extension/store-assets/icon-128.png`.
   - Unggah **Small Promotional Tile**: `apps/extension/store-assets/promo-440x280.png`.
   - Unggah **Screenshot**: `apps/extension/store-assets/screenshot-1280x800.png`.
5. **Pertanyaan Privasi**:
   - Apakah ekstensi mengumpulkan data pribadi? Pilih **No**.
   - Apakah ekstensi membutuhkan login pihak ketiga? Pilih **No**.
6. **Kirim untuk Ditinjau (Submit)**:
   - Klik tombol **Publish** di pojok kanan atas.
   - Proses peninjauan Microsoft Edge biasanya memakan waktu 1 sampai 3 hari kerja. Setelah disetujui, ekstensi akan langsung tersedia di Microsoft Edge Add-ons store.
