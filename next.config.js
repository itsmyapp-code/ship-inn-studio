/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not use `output: 'export'` for local dev because it forces static export
  // which breaks dynamic routes used by the embedded Sanity Studio.
  // trailingSlash: true, // Disabled to fix Keystatic API routes
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig