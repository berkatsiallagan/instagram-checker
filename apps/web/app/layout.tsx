import "@follback/ui/style.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Instagram Checker",
  description:
    "Check who does not follow you back on Instagram. Free, private, client-side tool running entirely in your browser.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
