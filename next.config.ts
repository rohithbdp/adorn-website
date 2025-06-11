import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/adorn-website',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
