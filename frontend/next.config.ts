import type { NextConfig } from "next";

const cmsApiUrl = process.env.CMS_API_URL?.trim().replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    // Backend routes and uploaded files remain same-origin for the browser.
    // CMS_API_URL must be present at build time for these rewrites to be emitted.
    if (!cmsApiUrl) return [];
    return [
      {
        source: "/Admin",
        destination: `${cmsApiUrl}/Admin`,
      },
      {
        source: "/uploads/:path*",
        destination: `${cmsApiUrl}/uploads/:path*`,
      },
      {
        source: "/Admin/:path*",
        destination: `${cmsApiUrl}/Admin/:path*`,
      },
      {
        source: "/Panel/:path*",
        destination: `${cmsApiUrl}/Panel/:path*`,
      },
    ];
  },
};

export default nextConfig;
