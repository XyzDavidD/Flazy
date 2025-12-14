/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable build cache to ensure fresh builds
  experimental: {
    // This helps with build consistency
  },
}

module.exports = nextConfig

