/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@aguia/ui", "@aguia/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
