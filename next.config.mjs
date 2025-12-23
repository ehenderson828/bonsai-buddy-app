/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript errors are now properly addressed
  // Image optimization is enabled for production
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wpaypgbiwamyzesgrogq.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
}

export default nextConfig
