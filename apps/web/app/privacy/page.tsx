"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PrivacyPage() {
  const [lang, setLang] = useState<"id" | "en">("id");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("preferred_lang") || localStorage.getItem("follback_lang");
      if (saved === "id" || saved === "en") {
        setLang(saved);
      } else if (navigator.language?.toLowerCase().startsWith("id")) {
        setLang("id");
      } else {
        setLang("en");
      }
    } catch {
      // fallback
    }
  }, []);

  const handleLangChange = (newLang: "id" | "en") => {
    setLang(newLang);
    try {
      localStorage.setItem("preferred_lang", newLang);
      localStorage.setItem("follback_lang", newLang);
    } catch {
      // ignore
    }
  };

  const isId = lang === "id";

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 16px 64px" }}>
      {/* Top Bar Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 0",
          marginBottom: "24px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <Link
          href="/"
          className="link-inline"
          style={{
            fontSize: "14px",
            textDecoration: "none",
            color: "var(--accent)",
            fontWeight: 500,
          }}
        >
          {isId ? "← Kembali ke Aplikasi" : "← Back to App"}
        </Link>
        <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => handleLangChange("id")}
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              cursor: "pointer",
              background: isId ? "var(--accent)" : "transparent",
              color: isId ? "var(--accent-fg)" : "var(--muted)",
              border: "1px solid var(--line)",
            }}
          >
            Bahasa Indonesia
          </button>
          <button
            type="button"
            onClick={() => handleLangChange("en")}
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              cursor: "pointer",
              background: !isId ? "var(--accent)" : "transparent",
              color: !isId ? "var(--accent-fg)" : "var(--muted)",
              border: "1px solid var(--line)",
            }}
          >
            English
          </button>
        </div>
      </nav>

      {/* Header */}
      <header style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "8px" }}>
          {isId ? "Kebijakan Privasi" : "Privacy Policy"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>
          {isId
            ? "Instagram Follow Back Checker • Terakhir diperbarui: 4 November 2026"
            : "Instagram Follow Back Checker • Last updated: November 4, 2026"}
        </p>
      </header>

      {/* Main Content */}
      <article style={{ lineHeight: "1.75", fontSize: "15px" }}>
        {isId ? (
          <>
            <p>
              Privasi Anda adalah nilai fundamental dari aplikasi <strong>Instagram Follow Back Checker</strong> (
              <code>ig.berkatsiallagan.com</code>) yang dikembangkan oleh <strong>Berkat Tua Siallagan</strong>.
              Kami merancang sistem ini dengan arsitektur <strong>Nol-Server (Zero-Backend)</strong>, yang berarti data
              Anda tidak pernah dikirim, disimpan, atau diproses di server mana pun.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              1. Pemrosesan Data 100% di Sisi Klien (Client-Side)
            </h2>
            <p>
              Seluruh berkas ekspor data resmi Instagram (seperti <code>followers_1.json</code>,{" "}
              <code>following.json</code>, <code>pending_follow_requests.json</code>, dan berkas lainnya) dibaca langsung
              di memori RAM peramban komputer atau ponsel Anda sendiri menggunakan API JavaScript modern.
            </p>
            <p>
              Situs ini menerapkan kebijakan keamanan <strong>Content Security Policy (CSP)</strong> ketat dengan aturan{" "}
              <code>connect-src &apos;none&apos;</code>, yang secara teknis memblokir peramban untuk mentransmisikan data
              keluar. Anda dapat memverifikasi hal ini melalui tab <em>Network</em> di peramban Anda.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              2. Kredensial & Kata Sandi
            </h2>
            <p>
              Aplikasi ini <strong>TIDAK PERNAH</strong> meminta, menyimpan, atau memiliki akses ke kata sandi (
              <em>password</em>) akun Instagram Anda, nomor telepon, atau token otentikasi rahasia Anda.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              3. Penggunaan Ekstensi Peramban (Extension)
            </h2>
            <p>
              Jika Anda menggunakan ekstensi browser Instagram Checker:
            </p>
            <ul style={{ paddingLeft: "20px" }}>
              <li>
                Ekstensi hanya berjalan ketika Anda secara sadar mengklik tombol <strong>Cek</strong>.
              </li>
              <li>
                Ekstensi mengakses sesi login aktif di tab <code>instagram.com</code> Anda sendiri untuk mengambil daftar
                pengikut dan yang Anda ikuti secara bertahap dengan jeda acak (<em>jitter delay</em>) agar aman dari
                pembatasan laju (*rate limit*).
              </li>
              <li>Hasil data dikirim langsung ke jendela ekstensi Anda secara lokal tanpa melalui pihak ketiga.</li>
            </ul>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              4. Penyimpanan Lokal (Local Storage)
            </h2>
            <p>
              Aplikasi menyimpan preferensi sederhana di penyimpanan lokal peramban Anda (
              <code>HTML5 localStorage</code>):
            </p>
            <ul style={{ paddingLeft: "20px" }}>
              <li>
                <code>preferred_lang</code>: Menyimpan pilihan bahasa antarmuka.
              </li>
              <li>
                <code>follback_unfollowed_v1</code>: Menyimpan status akun yang telah Anda tandai sebagai di-unfollow.
              </li>
              <li>
                <code>follback_snapshot_v1</code>: Menyimpan ringkasan analisis terakhir untuk membandingkan riwayat
                perubahan.
              </li>
            </ul>
            <p>
              Semua data lokal ini dapat Anda bersihkan sewaktu-waktu melalui tombol <strong>Hapus Data</strong> pada
              antarmuka aplikasi atau melalui menu pembersih data peramban Anda.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              5. Transparansi & Kode Sumber Terbuka
            </h2>
            <p>
              Seluruh kode sumber aplikasi ini bersifat terbuka (<em>open-source</em>) dan dapat diaudit secara bebas di
              repositori GitHub:{" "}
              <a
                href="https://github.com/berkatsiallagan/instagram-checker"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)" }}
              >
                github.com/berkatsiallagan/instagram-checker
              </a>
              .
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              6. Kontak Pengembang
            </h2>
            <p>
              Jika ada pertanyaan seputar keamanan dan privasi, silakan hubungi pengembang melalui:
            </p>
            <p>
              <strong>Berkat Tua Siallagan</strong>
              <br />
              Situs Web:{" "}
              <a href="https://berkatsiallagan.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
                berkatsiallagan.com
              </a>
            </p>
          </>
        ) : (
          <>
            <p>
              Your privacy is the core pillar of <strong>Instagram Follow Back Checker</strong> (
              <code>ig.berkatsiallagan.com</code>), engineered by <strong>Berkat Tua Siallagan</strong>.
              This platform runs on a <strong>Zero-Backend Architecture</strong>, meaning your data is never transmitted,
              stored, or processed on any external server.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              1. 100% Client-Side Processing
            </h2>
            <p>
              All Instagram export JSON files (such as <code>followers_1.json</code>, <code>following.json</code>,{" "}
              <code>pending_follow_requests.json</code>, and others) are parsed directly in your device&apos;s memory via
              standard browser JavaScript APIs.
            </p>
            <p>
              The website enforces a strict <strong>Content Security Policy (CSP)</strong> forbidding outbound network
              requests (<code>connect-src &apos;none&apos;</code>). You can verify this independently in your browser&apos;s
              developer tools.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              2. Credentials & Passwords
            </h2>
            <p>
              We <strong>NEVER</strong> ask for, store, or have access to your Instagram account password, phone number,
              or private authentication tokens.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              3. Browser Extension Usage
            </h2>
            <p>If you use the official Chrome extension:</p>
            <ul style={{ paddingLeft: "20px" }}>
              <li>The extension only runs when you intentionally click the <strong>Check</strong> button.</li>
              <li>
                It accesses your active <code>instagram.com</code> tab session to fetch follower and following lists with
                random jitter delays to protect your account from rate limits.
              </li>
              <li>All results are transferred directly to your local extension popup without third-party servers.</li>
            </ul>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              4. Local Storage
            </h2>
            <p>
              The application uses HTML5 <code>localStorage</code> strictly for your convenience:
            </p>
            <ul style={{ paddingLeft: "20px" }}>
              <li>
                <code>preferred_lang</code>: Persists your selected interface language.
              </li>
              <li>
                <code>follback_unfollowed_v1</code>: Remembers usernames you marked as unfollowed.
              </li>
              <li>
                <code>follback_snapshot_v1</code>: Caches your latest analysis summary for change tracking.
              </li>
            </ul>
            <p>
              You can wipe this data at any time using the <strong>Clear Data</strong> button in the UI or via your browser
              site data settings.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              5. Open Source Transparency
            </h2>
            <p>
              The complete source code is public and open for audit on GitHub:{" "}
              <a
                href="https://github.com/berkatsiallagan/instagram-checker"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)" }}
              >
                github.com/berkatsiallagan/instagram-checker
              </a>
              .
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              6. Developer Contact
            </h2>
            <p>For any inquiries regarding security and data privacy, please contact:</p>
            <p>
              <strong>Berkat Tua Siallagan</strong>
              <br />
              Website:{" "}
              <a href="https://berkatsiallagan.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
                berkatsiallagan.com
              </a>
            </p>
          </>
        )}
      </article>

      {/* Footer */}
      <footer
        style={{
          marginTop: "48px",
          paddingTop: "20px",
          borderTop: "1px solid var(--line)",
          textAlign: "center",
          color: "var(--muted)",
          fontSize: "13px",
        }}
      >
        <p style={{ margin: "0 0 8px" }}>
          <Link href="/terms" style={{ color: "var(--accent)", textDecoration: "none", marginRight: "16px" }}>
            {isId ? "Syarat & Ketentuan" : "Terms of Service"}
          </Link>
          <a
            href="https://github.com/berkatsiallagan/instagram-checker"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            GitHub
          </a>
        </p>
        <p style={{ margin: 0 }}>
          (c) {new Date().getFullYear()} Instagram Checker • Developed by{" "}
          <a
            href="https://berkatsiallagan.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            Berkat Tua Siallagan
          </a>
        </p>
      </footer>
    </main>
  );
}
