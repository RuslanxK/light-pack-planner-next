/** @type {import('next').NextConfig} */


const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ['images.unsplash.com', 'platform-lookaside.fbsbx.com', 'lh3.googleusercontent.com', 'light-pack-planner.s3.eu-north-1.amazonaws.com'],
  },
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
};

export default nextConfig;
