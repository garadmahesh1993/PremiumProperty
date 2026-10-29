/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep production builds separate from the development server's .next cache.
  distDir: process.env.NODE_ENV === "development" ? ".next" : ".next-production",
  devIndicators: false,
};

module.exports = nextConfig;
