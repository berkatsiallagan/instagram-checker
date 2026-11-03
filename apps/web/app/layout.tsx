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
    "Instagram Checker",
    "Follback Checker",
    "unfollowers instagram",
    "who unfollowed me on instagram",
    "check non followers instagram",
    "instagram unfollowers tracker",
    "free instagram tracker",
    "aplikasi cek follback ig",
    "cek siapa yang tidak follow back di instagram",
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
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/icon.png",
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
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 1200,
        alt: "Instagram Follow Back Checker Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Follow Back Checker",
    description:
      "Find out who does not follow you back on Instagram. 100% private, client-side in your browser.",
    images: ["/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["SoftwareApplication", "WebApplication"],
      "name": "Instagram Follow Back Checker",
      "alternateName": [
        "Instagram Checker",
        "Follback Checker",
        "Instagram Unfollower Tracker",
      ],
      "applicationCategory": "UtilitiesApplication",
      "applicationSubCategory": "Social Media Analytics",
      "operatingSystem": "All modern browsers (Chrome, Firefox, Safari, Edge)",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description":
        "Free and private Instagram Follow Back Checker. Find out who does not follow you back on Instagram without logging in or sending data to external servers. Features include local history tracking and relationship statistics.",
      "featureList": [
        "No login required",
        "100% client-side privacy",
        "Check non-reciprocal followers and fans",
        "Local history tracking for new unfollowers",
        "Comprehensive statistics and followback rate",
        "Sort usernames alphabetically (A-Z, Z-A)",
        "CSV export with formula injection protection",
      ],
      "author": {
        "@type": "Person",
        "name": "Berkat Tua Siallagan",
        "url": "https://berkatsiallagan.com",
        "jobTitle": "Website Architect & Full-Stack Developer",
        "sameAs": ["https://github.com/berkatsiallagan"],
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
              "Yes, 100% private. All parsing, difference calculations, and comparisons run client-side in your browser memory. No files, passwords, or personal data are ever sent to any remote server.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I check Instagram unfollowers without giving my password?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. You never need to enter your Instagram password or connect your account. You only drag and drop your official data export JSON files.",
          },
        },
        {
          "@type": "Question",
          "name": "How does local unfollower tracking work without storing data online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "The app compares your current file with your previous check stored privately in your device's browser localStorage, highlighting any accounts that unfollowed you since your last check.",
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
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
