import "@follback/ui/style.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const viewport: Viewport = {
  themeColor: "#1a3a6b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://instagram-checker.pages.dev"),
  title: "Instagram Follow Back Checker - Free & Private Unfollower Tracker",
  description:
    "Free, 100% private Instagram Follow Back Checker. Find out who does not follow you back on Instagram without logging in. Runs entirely in your browser.",
  keywords: [
    "Instagram Follow Back Checker",
    "Instagram Followback Checker",
    "instagram checker",
    "follback checker",
    "unfollowers instagram",
    "who unfollowed me on instagram",
    "cek follback instagram",
    "instagram followers following",
  ],
  authors: [{ name: "Berkat Tua Siallagan", url: "https://berkatsiallagan.com" }],
  creator: "Berkat Tua Siallagan",
  publisher: "Berkat Tua Siallagan",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "https://instagram-checker.pages.dev",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IG Checker",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Instagram Follow Back Checker - Free & Private Unfollower Tracker",
    description:
      "Find out who does not follow you back on Instagram. 100% private, client-side, runs in your browser without servers or login credentials.",
    url: "https://instagram-checker.pages.dev",
    siteName: "Instagram Follow Back Checker",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Instagram Follow Back Checker",
    description:
      "Find out who does not follow you back on Instagram. 100% private, client-side in your browser.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Instagram Follow Back Checker",
      "alternateName": ["Instagram Checker", "Follback Checker"],
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description":
        "Free and private Instagram Follow Back Checker. Find out who does not follow you back on Instagram without logging in or sending data to external servers.",
      "author": {
        "@type": "Person",
        "name": "Berkat Tua Siallagan",
        "url": "https://berkatsiallagan.com",
        "jobTitle": "Website Architect & Full-Stack Developer",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How to check who does not follow you back on Instagram?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Export your followers and following data in JSON format from Instagram Accounts Center, then load them into Instagram Follow Back Checker. The app compares the lists entirely in your browser without logging in.",
          },
        },
        {
          "@type": "Question",
          "name": "Is Instagram Follow Back Checker safe and private?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes, 100% private. All parsing and comparisons run client-side in your browser. No files, passwords, or data are sent to any remote server.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
