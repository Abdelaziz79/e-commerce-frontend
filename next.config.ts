/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**", // This wildcard allows any hostname over HTTPS
      },
      {
        protocol: "http",
        hostname: "**", // This allows any hostname over HTTP (less common)
      },
    ],
  },
};

export default nextConfig;
