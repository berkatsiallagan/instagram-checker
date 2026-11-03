/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  transpilePackages: ["@follback/core", "@follback/ui"],
  images: { unoptimized: true },
};

export default nextConfig;
