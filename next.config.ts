import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  ...(isDev ? {} : { output: 'export' }),
  // async rewrites() {
  //   if (!isDev || !process.env.NEXT_PUBLIC_BACKEND_URL) {
  //     return [];
  //   }

  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
  //     },
  //   ];
  // }, // FOR LOCAL DEVELOPMENT
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

  ...(isDev
    ? { allowedDevOrigins: ['192.168.8.137', '192.168.8.237', '192.168.8.191'] }
    : {}),
};

export default nextConfig;
