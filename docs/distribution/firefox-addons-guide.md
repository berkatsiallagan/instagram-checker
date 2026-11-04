# Panduan Publikasi ke Firefox Add-ons (AMO)

Firefox Add-ons (addons.mozilla.org / AMO) adalah direktori ekstensi resmi untuk peramban Mozilla Firefox di desktop dan mobile. Pendaftaran dan pengiriman ekstensi di sini adalah **100% GRATIS (Rp0)**.

---

## 1. Siapkan Berkas Paket & Aset
Semua berkas khusus Firefox sudah disiapkan di repository:
- **Paket ZIP Ekstensi**:
  Gunakan file `instagram-checker-firefox.zip` (hasil build dari `apps/extension/dist/firefox`).
  Paket ini sudah dilengkapi konfigurasi gecko ID `follback-checker@berkatsiallagan.github.io` dan izin pengumpulan data bernilai none.
- **Aset Gambar** (tersimpan di `apps/extension/store-assets/`):
  1. `icon-128.png` (Ikon 128x128)
  2. `screenshot-1280x800.png` (Tangkapan Layar)
- **Teks Deskripsi & Metadata**:
  Lihat file `docs/distribution/store-listing.md`.

---

## 2. Langkah Pendaftaran Akun Pengembang
1. Buka portal pengembang Mozilla Add-ons (AMO):
   https://addons.mozilla.org/developers/
2. Masuk menggunakan Firefox Account Anda (jika belum punya, buat akun gratis dengan email Anda).
3. Setujui ketentuan perjanjian pengembang Mozilla.
4. Akun langsung aktif seketika.

---

## 3. Langkah Pengiriman Add-on Baru
1. Di halaman AMO Developer Hub, klik tombol **Submit a New Add-on** (Kirim Add-on Baru).
2. **Pilih Jalur Distribusi**:
   - Pilih opsi **On this site** (Listed on addons.mozilla.org) agar ekstensi dapat ditemukan dan diunduh oleh publik.
3. **Unggah Berkas Ekstensi**:
   - Unggah file `instagram-checker-firefox.zip`.
   - Validator otomatis Mozilla akan memeriksa kode. Paket ini sudah dirancang kompatibel dengan Manifest V3 Firefox.
4. **Isi Pertanyaan Kode Sumber (Source Code)**:
   - Jika ditanya *"Did you use a build tool or transpile your code?"*:
     Pilih **Yes**.
   - Unggah zip repository atau berikan tautan repository GitHub publik:
     `https://github.com/berkatsiallagan/instagram-checker`
   - Berikan instruksi build singkat:
     `npm install && npm run build:firefox --workspace @follback/extension`
5. **Isi Halaman Listing**:
   - Name: `Instagram Checker - Who Does Not Follow You Back`
   - Summary: Salin dari `docs/distribution/store-listing.md`.
   - Description: Salin dari `docs/distribution/store-listing.md`.
   - Categories: Pilih **Social & Communication** dan **Photos, Music & Videos**.
   - Icon: Unggah `apps/extension/store-assets/icon-128.png`.
   - Preview image / Screenshot: Unggah `apps/extension/store-assets/screenshot-1280x800.png`.
   - Privacy Policy: `https://ig.berkatsiallagan.com/privacy`
   - Support Website / Email: `https://github.com/berkatsiallagan/instagram-checker/issues`
6. **Kirim (Submit)**:
   - Klik **Submit Version**.
   - Ekstensi yang bersih tanpa request pihak ketiga seperti ini sering kali disetujui dalam beberapa jam hingga 1 sampai 2 hari kerja.
