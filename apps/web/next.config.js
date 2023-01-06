/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.scdn.co'],
  },
  transpilePackages: ['@songstash/api'],
  experimental: {
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
