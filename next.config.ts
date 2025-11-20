import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['cdn2.iconfinder.com'],
  },
};

export default nextConfig;
