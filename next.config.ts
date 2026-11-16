import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      { source: "/about", destination: "/discover", permanent: true },
      { source: "/blog", destination: "/hubs", permanent: true },
      { source: "/blog/:path*", destination: "/hubs", permanent: true },
      { source: "/case-study", destination: "/explore", permanent: true },
      { source: "/case-study/:path*", destination: "/explore", permanent: true },
      { source: "/contact", destination: "/explore", permanent: true },
      { source: "/faqs", destination: "/discover", permanent: true },
      { source: "/legal-pages/:path*", destination: "/discover", permanent: true },
      { source: "/subpages/:path*", destination: "/discover", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/landing-static" }],
    };
  },
};

export default nextConfig;
