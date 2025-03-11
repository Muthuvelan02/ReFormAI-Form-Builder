/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,  // Helps catch potential issues
    experimental: {
      appDir: true,  // Enables support for Next.js App Router
    },
    webpack: (config) => {
      config.resolve.fallback = { fs: false };  // Fixes potential build errors with 'fs'
      return config;
    },
  };
  
  export default nextConfig;
  