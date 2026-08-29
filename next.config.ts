import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Article artwork in /public/images is SVG we generate ourselves, so the
     * optimizer is allowed to serve it — sandboxed, with scripts disabled.
     * Swapping in JPG/PNG photography later needs no change here.
     */
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // To pull article images from a CMS or CDN later, add its host here:
    // remotePatterns: [{ protocol: "https", hostname: "images.example.com" }],
  },
};

export default nextConfig;
