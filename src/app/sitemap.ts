import type { MetadataRoute } from "next";

import { allArticles, categories } from "@/data";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: site.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly" },
    { url: `${site.url}/search`, lastModified: now, changeFrequency: "daily" },
    { url: `${site.url}/archive`, lastModified: now, changeFrequency: "daily" },
    { url: `${site.url}/trending`, lastModified: now, changeFrequency: "daily" },
    { url: `${site.url}/write`, lastModified: now, changeFrequency: "monthly" },
    ...categories.map((category) => ({
      url: `${site.url}/category/${category.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...allArticles.map((article) => ({
      url: `${site.url}/article/${article.slug}`,
      lastModified: new Date(`${article.date}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
