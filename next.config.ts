import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['cdn2.iconfinder.com'],
  },
};

export default nextConfig;
