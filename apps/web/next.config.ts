import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/player.js",
        destination: "https://stats.mixon.dev/script.js",
      },
    ];
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
