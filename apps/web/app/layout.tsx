import "@follback/ui/style.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Follback Checker",
  description:
    "Check who does not follow you back on Instagram. Runs entirely in your browser.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
