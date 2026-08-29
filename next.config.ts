import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Every image on the site is now a JPEG lifted out of the printed PDFs, so
     * the SVG escape hatch this used to need is gone along with the generated
     * artwork it existed for.
     *
     * To pull article images from a CMS or CDN later, add its host here:
     * remotePatterns: [{ protocol: "https", hostname: "images.example.com" }],
     */
    contentDispositionType: "attachment",
  },
};

export default nextConfig;
