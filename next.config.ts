import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "pg", "@prisma/adapter-pg"],
  },
};

export default nextConfig;
