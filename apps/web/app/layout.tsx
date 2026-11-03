import "@follback/ui/style.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const viewport: Viewport = {
  themeColor: "#1a3a6b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://instagram-checker.pages.dev"),
  title: "Instagram Checker - Cek Follback Instagram Privat & Gratis",
  description:
    "Cek siapa yang tidak follow kamu balik di Instagram. 100% privat dan berjalan langsung di browser tanpa login atau kirim data ke server mana pun.",
  keywords: [
    "instagram checker",
    "follback checker",
    "unfollowers instagram",
    "cek unfollower ig",
    "instagram followers following",
  ],
  authors: [{ name: "Berkat Tua Siallagan", url: "https://berkatsiallagan.com" }],
  creator: "Berkat Tua Siallagan",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Instagram Checker - Cek Follback Instagram Privat & Gratis",
    description:
      "Alat gratis & privat untuk cek siapa yang tidak follow balik di Instagram langsung dari browser kamu tanpa server.",
    url: "https://instagram-checker.pages.dev",
    siteName: "Instagram Checker",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Instagram Checker - Cek Follback Instagram",
    description:
      "Cek siapa yang tidak follow balik di Instagram langsung di browser kamu. 100% privat, tanpa login.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
