# 🍪 Kebijakan Kuki & Penyimpanan Lokal (Cookie & Local Storage Policy)

*Terakhir diperbarui: 4 November 2026*

Dokumen ini menjelaskan bagaimana **Instagram Follow Back Checker** (`ig.berkatsiallagan.com` dan ekstensi browser terkait) mengelola kuki (*cookies*) dan media penyimpanan lokal (*localStorage*) di peramban Anda.

---

## 1. Zero Tracking Cookies (Nol Kuki Pelacak)

Situs web `ig.berkatsiallagan.com` **TIDAK MENGGUNAKAN** kuki pelacak pihak ketiga (*third-party tracking cookies*), kuki iklan (*advertising cookies*), atau kuki analitik perilaku (*behavioral profiling cookies*). 

Situs ini dapat diakses dan digunakan sepenuhnya tanpa memerlukan izin penyimpanan kuki pihak ketiga.

---

## 2. Penggunaan Penyimpanan Lokal Peramban (HTML5 LocalStorage)

Alih-alih mengirim data ke server, seluruh status dan preferensi aplikasi disimpan di memori peramban Anda sendiri menggunakan standar industri HTML5 LocalStorage:

| Nama Kunci (*Key*) | Tujuan & Fungsi | Lokasi Penyimpanan | Masa Berlaku |
|---|---|---|---|
| `preferred_lang` | Menyimpan preferensi bahasa pilihan pengguna (`id` atau `en`). | Peramban Pengguna | Tersimpan sampai dibersihkan |
| `follback_unfollowed_v1` | Menyimpan daftar username akun yang sudah ditandai sebagai di-unfollow atau di-follow manual oleh pengguna. | Peramban Pengguna | Tersimpan sampai dibersihkan |
| `follback_snapshot_v1` | Menyimpan ringkasan analisis terakhir untuk menampilkan perbandingan riwayat perubahan akun. | Peramban Pengguna | Tersimpan sampai dibersihkan |

---

## 3. Cara Mengelola dan Menghapus Penyimpanan Lokal

Anda memiliki kendali penuh 100% terhadap data yang tersimpan di peramban Anda:
1. **Melalui Tombol di Aplikasi**: Anda dapat mengklik tombol **"Hapus Data"** pada bagian riwayat antarmuka untuk seketika membersihkan salinan lokal.
2. **Melalui Menu Pengaturan Peramban**:
   - Di Google Chrome / Edge / Brave: Buka `Settings` > `Privacy and security` > `Cookies and other site data` > cari `ig.berkatsiallagan.com` > klik `Remove all`.
   - Di Mozilla Firefox: Buka `Settings` > `Privacy & Security` > `Cookies and Site Data` > `Manage Data` > cari `ig.berkatsiallagan.com` > klik `Remove Selected`.

---

## 4. Kuki Sesi Ekstensi Peramban

Khusus untuk ekstensi peramban Instagram Checker:
- Ekstensi membaca kuki sesi login resmi Instagram (`sessionid`, `csrftoken`) yang sudah ada di tab `instagram.com` Anda agar Anda tidak perlu memasukkan username atau password.
- Ekstensi **TIDAK PERNAH** menyalin, menyimpan permanen, atau mentransmisikan kuki sesi tersebut ke luar perangkat Anda. Kuki tersebut hanya digunakan sesaat di memori RAM untuk mengotentikasi permintaan pagination followers & following langsung ke server Instagram.
