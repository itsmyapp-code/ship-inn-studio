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
  env: {
    OST_GITHUB_ID: process.env.OST_GITHUB_ID,
    OST_GITHUB_SECRET: process.env.OST_GITHUB_SECRET,
    OST_REPO_SLUG: process.env.OST_REPO_SLUG,
    OST_REPO_OWNER: process.env.OST_REPO_OWNER,
    OST_TOKEN_SECRET: process.env.OST_TOKEN_SECRET,
  },
}

module.exports = nextConfig