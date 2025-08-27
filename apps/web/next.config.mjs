/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  // Enable static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  // Optional: set basePath at build time for project pages (e.g., '/repo-name')
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined
};

export default nextConfig;
