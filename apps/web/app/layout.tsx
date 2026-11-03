import "@follback/ui/style.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const viewport: Viewport = {
  themeColor: "#1a3a6b",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ig.berkatsiallagan.com"),
  title: "Instagram Follow Back Checker",
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
  verification: {
    google: "S-SN_9JquRtuZYP1gW-SlpPYLaZoRxkqOJD-Sqr9p4Q",
  },
  alternates: {
    canonical: "https://ig.berkatsiallagan.com",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IG Checker",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Instagram Follow Back Checker",
    description:
      "Find out who does not follow you back on Instagram. 100% private, client-side, runs in your browser without servers or login credentials.",
    url: "https://ig.berkatsiallagan.com",
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

const faqs = [
  {
    q: "What is Instagram Follow Back Checker?",
    a: "Instagram Follow Back Checker is a free, 100% private web tool that compares your Instagram followers and following lists to show who does not follow you back, who your fans are, and who follows you mutually."
  },
  {
    q: "How does the Instagram Follow Back Checker work?",
    a: "It reads your official Instagram data export files (followers_1.json and following.json) directly in your browser and calculates relationship differences in memory without server requests."
  },
  {
    q: "Is Instagram Follow Back Checker completely free?",
    a: "Yes, it is 100% free with no subscriptions, premium tiers, paywalls, or hidden charges."
  },
  {
    q: "Do I need to enter my Instagram password or credentials?",
    a: "Never. The tool does not ask for or require your Instagram password, username, or login credentials."
  },
  {
    q: "Can using Instagram Follow Back Checker get my account banned or restricted?",
    a: "No. Because it runs offline on your official JSON export and makes no automated requests to Instagram servers, your account is completely safe from blocks or bans."
  },
  {
    q: "How to check who does not follow you back on Instagram?",
    a: "Request a JSON export of your followers and following data from Instagram Accounts Center, extract the files, and drop followers_1.json and following.json into this checker."
  },
  {
    q: "How do I request my Instagram data export from Meta Accounts Center?",
    a: "Go to Settings > Accounts Center > Your information and permissions > Download your information, choose your profile, select Followers and following, choose JSON format, and submit the request."
  },
  {
    q: "Why must I choose JSON format instead of HTML when downloading Instagram data?",
    a: "JSON is a structured data format required by data parsing tools. HTML files are styled web pages that cannot be parsed reliably for list comparisons."
  },
  {
    q: "How long does it take for Instagram to prepare my data export?",
    a: "Instagram usually generates the export file within 5 to 30 minutes, after which Meta sends an email notification with a download link."
  },
  {
    q: "Where are followers_1.json and following.json located inside the zip file?",
    a: "After extracting the downloaded zip file, open the connections folder, then go to followers_and_following to find followers_1.json and following.json."
  },
  {
    q: "Can I upload multiple followers files if I have a large account?",
    a: "Yes. If your account has many followers, Instagram may generate followers_1.json, followers_2.json, etc. You can drop all of them together into the upload zone."
  },
  {
    q: "What does the Not following back tab mean?",
    a: "The Not following back tab lists users whom you follow on Instagram, but who do not follow you back."
  },
  {
    q: "What does the Fans tab mean?",
    a: "The Fans tab lists users who follow your Instagram account, but whom you do not follow back."
  },
  {
    q: "What does the Mutual tab mean?",
    a: "The Mutual tab lists accounts where you follow them and they also follow you back."
  },
  {
    q: "What is the Followback Rate shown in the Stats Card?",
    a: "The Followback Rate is the percentage of people you follow who reciprocate by following you back, calculated as mutual follows divided by total following."
  },
  {
    q: "Does Instagram Follow Back Checker upload my data to any remote server?",
    a: "No. Everything runs strictly in your browser memory via client-side JavaScript. The website has a strict Content Security Policy blocking all outbound data connections."
  },
  {
    q: "Does Instagram Follow Back Checker use tracking cookies or third-party analytics?",
    a: "No. There are zero tracking scripts, zero third-party analytics, zero ad networks, and zero tracking cookies."
  },
  {
    q: "What happens if I upload an invalid or corrupted file?",
    a: "The tool displays a clear, localized error message explaining whether the file is invalid JSON, missing required fields, or not from Instagram."
  },
  {
    q: "Why do I see the error Both files are required: followers_1.json and following.json?",
    a: "Comparison requires both who you follow and who follows you. Make sure you select and drop both files into the upload box at the same time."
  },
  {
    q: "Why do I see the error Unrecognized JSON format?",
    a: "This happens if you upload an unrelated JSON file or an HTML export instead of the followers and following JSON files from Instagram."
  },
  {
    q: "How does the Local History feature detect new unfollowers?",
    a: "When you check your data, the tool securely stores a follower list snapshot in your browser localStorage. On future checks, it compares current followers with the snapshot to highlight who unfollowed you."
  },
  {
    q: "Where is my local comparison history stored?",
    a: "Your comparison snapshots are stored exclusively in your own device browser localStorage and never leave your phone or computer."
  },
  {
    q: "Can anyone else see my local history snapshots?",
    a: "No. LocalStorage is isolated to your specific browser on your personal device and cannot be accessed by external parties."
  },
  {
    q: "How can I clear or delete my local comparison history?",
    a: "You can clear your local history at any time by clearing your browser cache or site data for this domain."
  },
  {
    q: "How do I sort the list of unfollowers alphabetically from A to Z or Z to A?",
    a: "Use the sort dropdown menu next to the search bar in the results section to choose between Default order, Username (A - Z), or Username (Z - A)."
  },
  {
    q: "Can I search for a specific Instagram username inside the results?",
    a: "Yes. Type any part of an account username into the search bar, and the list will filter instantly in real time."
  },
  {
    q: "How do I export my unfollower list to a CSV spreadsheet?",
    a: "Click the Export CSV button at the bottom of the results section to download a formatted CSV file compatible with Excel, Google Sheets, and Numbers."
  },
  {
    q: "How does the CSV export protect against spreadsheet formula injection?",
    a: "Usernames beginning with formula triggers like equals, plus, minus, or at are automatically prepended with a single quote to prevent spreadsheet code execution."
  },
  {
    q: "Can I click on a username to view their Instagram profile directly?",
    a: "Yes. Every username in the result list includes a direct Open profile link that opens their profile on instagram.com in a new tab."
  },
  {
    q: "Can I install Instagram Follow Back Checker as an app on my phone?",
    a: "Yes. The website is a Progressive Web App (PWA) that can be installed on both Android and iOS devices."
  },
  {
    q: "How do I install the PWA on an Android device using Google Chrome?",
    a: "Open the site in Chrome, tap the three-dot menu icon in the upper right corner, and select Install app or Add to Home screen."
  },
  {
    q: "How do I install the PWA on an iPhone using Safari?",
    a: "Open the site in Safari, tap the Share icon at the bottom of the screen, scroll down, and tap Add to Home Screen."
  },
  {
    q: "Does Instagram Follow Back Checker work offline without an internet connection?",
    a: "Yes. The built-in Service Worker caches the application assets so you can open and use the tool completely offline without mobile data."
  },
  {
    q: "How does the offline Service Worker cache work?",
    a: "On your first visit, the service worker stores HTML, CSS, JavaScript, and icons in your local browser cache, serving them instantly on subsequent loads."
  },
  {
    q: "Why is this web tool safer than third-party apps on the App Store or Google Play?",
    a: "Most mobile apps require your Instagram login and password, which risks password theft, account suspension, or shadowbanning. This tool operates strictly on offline export files."
  },
  {
    q: "Does Instagram notify users when I check if they follow me back?",
    a: "No. Checking an offline data export does not send any signals to Instagram or to the users you are checking."
  },
  {
    q: "Can I use Instagram Follow Back Checker on desktop computers, tablets, and mobile phones?",
    a: "Yes. The interface is fully responsive and optimized for mobile screens, tablets, laptops, and desktop displays."
  },
  {
    q: "Can I use this checker for verified, creator, or business Instagram accounts?",
    a: "Yes. As long as you can request a data export from your Meta Accounts Center, any personal, creator, business, or verified account works."
  },
  {
    q: "Is there a limit on the number of followers or following accounts I can check?",
    a: "No arbitrary limit. Modern JavaScript engines easily handle tens of thousands of usernames in fractions of a second."
  },
  {
    q: "How often should I download my data to check for unfollowers?",
    a: "Whenever you want an accurate update, such as once a week or once a month. Download a new JSON export and drop it into the tool."
  },
  {
    q: "Does this application support multiple languages?",
    a: "Yes. It fully supports both English and Bahasa Indonesia with seamless real-time switching."
  },
  {
    q: "How do I switch languages between English and Bahasa Indonesia?",
    a: "Use the language selector dropdown in the top right corner of the page to switch between Bahasa Indonesia and English."
  },
  {
    q: "What should I do if Instagram changes its data export menu layout?",
    a: "Look for Download your information in Meta Accounts Center. Instagram periodically moves menus, but the export feature remains under Accounts Center."
  },
  {
    q: "Can I check unfollowers on a private Instagram account?",
    a: "Yes. The data export comes directly from your own authenticated account, so private accounts work identically to public accounts."
  },
  {
    q: "Does this tool work with multiple Instagram accounts?",
    a: "Yes. You can check multiple accounts simply by dropping the export files of each respective account one at a time."
  },
  {
    q: "Why does my follower count in the app differ slightly from my profile count?",
    a: "Profile counts on Instagram often cache deactivated, suspended, or bot accounts that Meta filters out from the raw data export."
  },
  {
    q: "Who created and developed Instagram Follow Back Checker?",
    a: "Instagram Follow Back Checker was designed and built by Berkat Tua Siallagan, a Website Architect & Full-Stack Developer based in Indonesia. Visit his portfolio at https://berkatsiallagan.com"
  },
  {
    q: "What technologies and architecture are used to build this application?",
    a: "It is built with strict TypeScript, Next.js static export, an independent core library without runtime dependencies, and an ultra-lean CSS design system."
  },
  {
    q: "Is the Instagram Follow Back Checker source code open source?",
    a: "Yes. The entire codebase is open source under the permissive MIT license."
  },
  {
    q: "How can I hire or contact Berkat Tua Siallagan for custom web development?",
    a: "You can get in touch with Berkat Tua Siallagan through his official portfolio website at https://berkatsiallagan.com or via GitHub at https://github.com/berkatsiallagan for architectural consultation, web applications, and software engineering."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["SoftwareApplication", "WebApplication"],
      "name": "Instagram Follow Back Checker",
      "url": "https://ig.berkatsiallagan.com",
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
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a,
        },
      })),
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
              "if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})};document.addEventListener('gesturestart',function(e){e.preventDefault()});",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
