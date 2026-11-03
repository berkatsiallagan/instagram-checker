import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Layanan - Instagram Follow Back Checker",
  description:
    "Ketentuan penggunaan, penafian afiliasi Instagram/Meta Platforms, dan batasan tanggung jawab pada ig.berkatsiallagan.com.",
  alternates: {
    canonical: "https://ig.berkatsiallagan.com/terms",
  },
};

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children;
}
