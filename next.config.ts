import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  enablePrerenderSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
  },
};

export default nextConfig;
