# Kebijakan Privasi (Privacy Policy) - Instagram Follow Back Checker

*Terakhir diperbarui: 4 November 2026*

Selamat datang di **Instagram Follow Back Checker** (`ig.berkatsiallagan.com` dan ekstensi peramban resmi Instagram Checker), sebuah layanan yang dikembangkan dan dikelola secara independen oleh **Berkat Tua Siallagan** ([berkatsiallagan.com](https://berkatsiallagan.com)).

Kami memegang teguh komitmen privasi mutlak. Layanan ini dirancang sejak awal dengan prinsip **Arsitektur Nol-Server (*Zero-Backend Architecture*)**, di mana seluruh proses komparasi dan analisis data berjalan 100% secara lokal di peramban (*client-side*) perangkat Anda. Dokumen ini menjelaskan prinsip transparansi kami sesuai dengan **Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022)** di Indonesia dan standar perlindungan data internasional (**GDPR**).

---

## 1. Prinsip Utama: Pemrosesan 100% di Sisi Klien (Client-Side)

1. **Tanpa Server Backend**: Platform ini tidak memiliki peladen basis data (*database server*), API backend eksternal, atau layanan analitik terpusat untuk menyimpan riwayat atau profil Anda.
2. **Koneksi Dibatasi Ketat (Strict CSP)**: Situs web `ig.berkatsiallagan.com` menerapkan *Content Security Policy* ketat (`connect-src 'none'`) yang secara teknis memblokir peramban Anda untuk mengirimkan data ke luar jaringan lokal perangkat Anda.
3. **Tanpa Pengumpulan Kata Sandi**: Anda tidak pernah dimintai kata sandi (*password*), token akses pihak ketiga, atau kredensial rahasia apa pun saat menggunakan web maupun ekstensi.

---

## 2. Informasi yang Diproses dan Mekanismenya

### A. Melalui Unggah File JSON (Aplikasi Web)
- Saat Anda mengunggah berkas ekspor data resmi Instagram (seperti `followers_1.json`, `following.json`, `pending_follow_requests.json`, `close_friends.json`, dan file lainnya), berkas tersebut dibaca langsung oleh memori JavaScript peramban Anda menggunakan API `FileReader` / `File.text()`.
- Data tersebut **TIDAK PERNAH** diunggah ke server mana pun melalui internet. Begitu tab peramban ditutup atau halaman dimuat ulang, data di memori kerja akan otomatis hilang kecuali Anda menyimpannya ke penyimpanan lokal perangkat Anda.

### B. Melalui Ekstensi Peramban (Chrome Extension)
- Ekstensi hanya beroperasi ketika Anda menekan tombol **Cek** secara sadar pada tab `instagram.com` yang sedang aktif dan sudah terautentikasi oleh Anda sendiri.
- Ekstensi membaca token sesi dan cookie yang sudah tersimpan di peramban Anda untuk melakukan panggilan pagination resmi ke endpoint internal Instagram secara bertahap dengan jeda acak (*jitter delay*) demi keamanan akun.
- Seluruh hasil daftar pengikut dan akun yang diikuti dikirimkan langsung dari tab Instagram ke jendela ekstensi Anda secara lokal (`chrome.runtime.sendMessage`), tanpa perantara pihak ketiga.

---

## 3. Penggunaan Penyimpanan Lokal (Local Storage)

Aplikasi ini menggunakan penyimpanan lokal peramban (*HTML5 localStorage*) semata-mata untuk kenyamanan operasional Anda:
1. `preferred_lang`: Menyimpan preferensi bahasa yang Anda pilih (`id` atau `en`).
2. `follback_unfollowed_v1`: Menyimpan daftar akun yang telah Anda tandai sebagai "sudah di-unfollow" atau "sudah di-follow" agar tidak perlu ditandai ulang.
3. `follback_snapshot_v1`: Menyimpan salinan ringkasan analisis terakhir untuk mendeteksi perubahan jika Anda mengunggah data baru di masa mendatang.

> **Kontrol Penuh Anda**: Anda dapat menghapus seluruh data lokal ini kapan saja dengan mengklik tombol **"Hapus Data"** pada antarmuka aplikasi atau melalui menu pengaturan peramban Anda (*Clear Site Data*).

---

## 4. Pelacak dan Cookie Pihak Ketiga

- Kami **TIDAK MENGGUNAKAN** Google Analytics, Facebook Pixel, kuki pelacak periklanan, atau skrip pelacak perilaku pengguna lainnya.
- Kami tidak menjual, memperdagangkan, menyewakan, atau memonetisasi data daftar pertemanan atau akun Instagram Anda kepada pihak mana pun.

---

## 5. Hak Anda atas Data Pribadi

Sesuai ketentuan hukum UU PDP dan GDPR, Anda memiliki hak penuh:
1. **Hak Audit Terbuka**: Seluruh kode sumber aplikasi ini terbuka (*open-source*) di repositori GitHub kami di [github.com/berkatsiallagan/instagram-checker](https://github.com/berkatsiallagan/instagram-checker), sehingga Anda dapat mengaudit langsung bahwa klaim privasi di atas benar-benar diterapkan.
2. **Hak Penghapusan Mutlak**: Karena data hanya berada di peramban Anda, Anda memegang kendali 100% untuk menghapus berkas dan riwayat kapan saja.

---

## 6. Kontak Pengelola

Jika Anda memiliki pertanyaan mengenai implementasi keamanan atau kebijakan privasi ini, Anda dapat menghubungi kami melalui:
- **Pengembang & Arsitek**: Berkat Tua Siallagan
- **Situs Resmi**: [berkatsiallagan.com](https://berkatsiallagan.com)
- **Repositori Proyek**: [github.com/berkatsiallagan/instagram-checker](https://github.com/berkatsiallagan/instagram-checker)
