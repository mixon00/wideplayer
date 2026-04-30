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
      {
        source: "/api/send",
        destination: "https://stats.mixon.dev/api/send",
      },
    ];
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
