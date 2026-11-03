import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi - Instagram Follow Back Checker",
  description:
    "Transparansi privasi, arsitektur nol-server, pemrosesan 100% lokal di browser, dan kepatuhan UU PDP pada ig.berkatsiallagan.com.",
  alternates: {
    canonical: "https://ig.berkatsiallagan.com/privacy",
  },
};

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return children;
}
