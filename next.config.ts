import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn2.iconfinder.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
