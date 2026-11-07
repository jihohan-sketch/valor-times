import type { Metadata } from "next";

import { site } from "@/lib/site";

/**
 * Metadata for one page, with its own Open Graph and Twitter titles.
 *
 * Next merges metadata shallowly: a page that sets only `title` inherits the
 * layout's whole `openGraph` object, so every shared link used to preview as
 * plain "The Valor Times". This sets the social title to the same
 * "Psychology · The Valor Times" the browser tab shows.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  images,
  extra,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  images?: { url: string }[];
  /** Anything else the page sets, e.g. `alternates`. */
  extra?: Metadata;
}): Metadata {
  const full = `${title} · ${site.name}`;
  return {
    title,
    description,
    openGraph: {
      type,
      siteName: site.name,
      title: full,
      description,
      url: `${site.url}${path}`,
      ...(images ? { images } : {}),
    },
    twitter: { card: "summary_large_image", title: full, description },
    ...extra,
  };
}
