/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.com",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@supabase/ssr": require.resolve("@supabase/ssr"),
      "@supabase/supabase-js": require.resolve("@supabase/supabase-js"),
    }
    return config
  },
}

export default nextConfig
