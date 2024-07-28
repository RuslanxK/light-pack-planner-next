/** @type {import('next').NextConfig} */


const nextConfig = {
  experimental: {
    reactCompiler: true,
    serverComponentsExternalPackages: ["mongoose"],
    optimizePackageImports: ['package-name'],
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
