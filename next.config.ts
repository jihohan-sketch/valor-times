import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy.
 *
 * `script-src` carries 'unsafe-inline' and that is a real limitation, stated
 * rather than hidden: Next inlines its own bootstrap on every page, and the
 * reduced-motion check in layout.tsx has to run before the first paint. The
 * strict alternative is a per-request nonce, which means middleware and means
 * every page rendering dynamically — a poor trade for a paper that is almost
 * entirely static and renders no user-supplied HTML anywhere.
 *
 * What the policy does buy is the rest of it: script and style can only come
 * from this origin, so an injection cannot pull a payload off someone else's
 * host; `connect-src 'self'` means it cannot phone data out; `object-src`
 * and `base-uri` close two old hijacks; and `frame-ancestors` keeps the paper
 * out of everyone else's iframe.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  /* The version of the framework is not the reader's business, and it is a
     free hint to anyone shopping for a known bug. */
  poweredByHeader: false,

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

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        /* Newsroom uploads are the one place on this origin serving bytes a
           person chose. The upload route already refuses anything that is not
           a real bitmap; this is the second lock — nosniff so the declared
           type is the only type, and attachment so following the URL straight
           downloads the file rather than rendering it as a document on this
           origin. Neither affects an <img> on a story page. */
        source: "/uploads/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Content-Disposition", value: "attachment" },
        ],
      },
    ];
  },
};

export default nextConfig;
