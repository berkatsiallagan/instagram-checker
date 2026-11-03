"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TermsPage() {
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
          {isId ? "Syarat dan Ketentuan Layanan" : "Terms of Service"}
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
              Selamat datang di <strong>Instagram Follow Back Checker</strong> (<code>ig.berkatsiallagan.com</code>)
              dan ekstensi peramban terkait yang dikembangkan oleh <strong>Berkat Tua Siallagan</strong>.
              Dengan mengakses dan menggunakan layanan ini, Anda menyatakan setuju untuk terikat oleh Syarat dan
              Ketentuan berikut ini.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              1. Ruang Lingkup Layanan
            </h2>
            <p>
              Layanan ini disediakan sebagai alat bantu utilitas berbasis peramban (<em>client-side browser utility</em>)
              untuk membantu Anda membandingkan daftar pengikut (<em>followers</em>) dan akun yang Anda ikuti (
              <em>following</em>) dari akun Instagram pribadi Anda secara aman tanpa mengorbankan privasi kata sandi.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              2. Penafian Afiliasi Pihak Ketiga (Disclaimer)
            </h2>
            <div
              style={{
                background: "rgba(143, 176, 232, 0.08)",
                borderLeft: "3px solid var(--accent)",
                padding: "12px 16px",
                margin: "16px 0",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>Pemberitahuan Penting:</strong> Aplikasi ini adalah proyek perangkat lunak independen dan{" "}
                <strong>TIDAK BERAFIAT</strong>, tidak disponsori, tidak didukung, dan tidak berafiliasi secara resmi
                dengan <strong>Instagram</strong>, <strong>Meta Platforms, Inc.</strong>, atau afiliasinya.
                Nama &quot;Instagram&quot; dan logo terkait adalah merek dagang terdaftar milik Meta Platforms, Inc.
              </p>
            </div>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              3. Aturan Perilaku Pengguna
            </h2>
            <p>Dalam menggunakan situs maupun ekstensi ini, Anda menyetujui untuk:</p>
            <ul style={{ paddingLeft: "20px" }}>
              <li>
                Hanya menganalisis data ekspor atau akun Instagram milik Anda sendiri secara sah.
              </li>
              <li>
                Tidak menggunakan perangkat lunak ini untuk aktivitas spam, pengikisan data otomatis massal (
                <em>abusive scraping</em>), pelecehan, atau tindakan melanggar hukum.
              </li>
              <li>
                Tidak menyebarkan versi modifikasi tidak resmi yang disisipkan perangkat lunak berbahaya (
                <em>malware</em>).
              </li>
            </ul>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              4. Batasan Tanggung Jawab (Limitation of Liability)
            </h2>
            <p>
              Layanan ini disediakan &quot;sebagaimana adanya&quot; (<em>as is</em>) dan &quot;sebagaimana tersedia&quot; (
              <em>as available</em>) tanpa garansi apa pun.
            </p>
            <p>
              Pengembang tidak bertanggung jawab atas tindakan pembatasan akun, pemblokiran sementara (*action block*),
              atau penegakan kebijakan yang diberlakukan oleh Instagram / Meta Platforms terhadap akun Anda akibat tindakan
              unfollow manual dalam jumlah besar atau aktivitas lain di luar kendali pengembang.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              5. Hak Cipta & Lisensi
            </h2>
            <p>
              Arsitektur kode sumber, modul algoritma, dan desain antarmuka adalah karya cipta Berkat Tua Siallagan dan
              dilisensikan di bawah lisensi terbuka MIT di repositori GitHub kami.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              6. Hukum yang Mengatur
            </h2>
            <p>
              Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Negara Kesatuan Republik Indonesia.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              7. Kontak Resmi
            </h2>
            <p>Untuk pertanyaan hukum atau informasi lebih lanjut, silakan hubungi:</p>
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
              Welcome to <strong>Instagram Follow Back Checker</strong> (<code>ig.berkatsiallagan.com</code>)
              and its accompanying browser extensions developed by <strong>Berkat Tua Siallagan</strong>.
              By accessing and using this service, you agree to be bound by the following Terms of Service.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              1. Service Scope
            </h2>
            <p>
              This platform is an independent, client-side utility designed to help users inspect their follower and
              following relationships locally within their browser without sharing account credentials.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              2. Third-Party Disclaimer
            </h2>
            <div
              style={{
                background: "rgba(143, 176, 232, 0.08)",
                borderLeft: "3px solid var(--accent)",
                padding: "12px 16px",
                margin: "16px 0",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>Important Notice:</strong> This software is an independent third-party tool and is{" "}
                <strong>NOT AFFILIATED</strong>, endorsed, sponsored, or certified by <strong>Instagram</strong> or{" "}
                <strong>Meta Platforms, Inc.</strong> The trademark &quot;Instagram&quot; and related assets belong to
                Meta Platforms, Inc.
              </p>
            </div>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              3. Acceptable Use
            </h2>
            <p>You agree to:</p>
            <ul style={{ paddingLeft: "20px" }}>
              <li>Analyze only your own authorized personal Instagram export data or account session.</li>
              <li>Refrain from abusive mass scraping, automated spamming, harassment, or unlawful operations.</li>
              <li>Not distribute tampered or malicious variants of this software.</li>
            </ul>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              4. Disclaimer of Warranties & Liability
            </h2>
            <p>
              The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind.
            </p>
            <p>
              The developer assumes no liability for rate-limiting, temporary action blocks, or enforcement actions
              taken by Instagram / Meta Platforms regarding your account as a result of manual bulk unfollow activity or
              other platform-side interactions.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              5. Intellectual Property
            </h2>
            <p>
              The source code, algorithm implementation, and visual interface are copyrighted by Berkat Tua Siallagan
              under the permissive MIT open-source license.
            </p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              6. Governing Law
            </h2>
            <p>These terms are governed by and construed in accordance with the laws of the Republic of Indonesia.</p>

            <h2 style={{ fontSize: "18px", marginTop: "28px", marginBottom: "12px", color: "var(--fg)" }}>
              7. Contact
            </h2>
            <p>For inquiries, please contact:</p>
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
          <Link href="/privacy" style={{ color: "var(--accent)", textDecoration: "none", marginRight: "16px" }}>
            {isId ? "Kebijakan Privasi" : "Privacy Policy"}
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
          © {new Date().getFullYear()} Instagram Checker • Developed by{" "}
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
