/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./styles'],
  },
  experimental: {
    // Remove deprecated appDir option
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
