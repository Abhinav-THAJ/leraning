import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    // Allow any image source including unoptimized local images
    unoptimized: false,
  },
};

export default nextConfig;
