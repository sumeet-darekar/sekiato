/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  typescript: {
    // WARNING: This allows production builds to complete even if there are type errors.
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;