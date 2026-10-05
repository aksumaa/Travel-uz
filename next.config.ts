import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', 'iconsax-react'],
  allowedDevOrigins: ['localhost', '127.0.0.1'],
};

export default nextConfig;
