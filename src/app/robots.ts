import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    /* The desk routes used to be listed here as Disallow lines. A robots file
       is public, nothing links to those paths, and a crawler has no other way
       to learn they exist — so the list was an index of the way in rather than
       a lock on it. They are guarded by the session cookie, which is what
       actually keeps anyone out. */
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
