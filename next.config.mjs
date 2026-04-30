/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    unoptimized: true, // Useful for Vercel if using many external high-res assets
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  experimental: {
    serverComponentsExternalPackages: ["pdfjs-dist", "@prisma/client"],
    outputFileTracingIncludes: {
      "/*": ["./prisma/**/*", "./dev.db"],
    },
    outputFileTracingExcludes: {
      "*": [
        "./public/media/**/*", 
        "./public/media/video/**/*", 
        "./public/media/foto/**/*",
        "./scripts/**/*",
        "./scratch/**/*",
        "./artifacts/**/*"
      ],
    },
  },
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default nextConfig;
