import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Instagram Checker",
    short_name: "IG Checker",
    description:
      "Find out who does not follow you back on Instagram. 100% client-side and private.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a3a6b",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };
}
