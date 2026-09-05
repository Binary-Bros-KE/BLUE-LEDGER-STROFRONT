import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // When the P3 image pipeline lands, product photos are served from the Cloudflare R2 bucket's
  // public/custom domain (SERVER env R2_PUBLIC_BASE_URL). Add that host here so next/image can
  // optimise it, e.g.:
  //   images: { remotePatterns: [{ protocol: "https", hostname: "images.blueledgerpos.app" }] },
};

export default nextConfig;
