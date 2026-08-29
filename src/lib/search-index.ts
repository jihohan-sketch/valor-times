import { allArticles, authorBySlug, categoryBySlug } from "@/data";

/**
 * A compact index shipped to the client for the search overlay.
 * Deliberately excludes article bodies — the overlay searches titles, deks,
 * tags, categories and authors, which is what people actually type.
 */
export interface SearchEntry {
  slug: string;
  title: string;
  dek: string;
  category: string;
  categoryName: string;
  author: string;
  date: string;
  image: string;
  imageAlt: string;
  tags: string[];
  /** Pre-lowercased haystack, so the client does no string work per keystroke. */
  haystack: string;
}

export function buildSearchIndex(): SearchEntry[] {
  return allArticles.map((article) => {
    const author = authorBySlug[article.authorSlug]?.name ?? "";
    const category = categoryBySlug[article.category];

    return {
      slug: article.slug,
      title: article.title,
      dek: article.dek,
      category: article.category,
      categoryName: category.name,
      author,
      date: article.date,
      image: article.image,
      imageAlt: article.imageAlt,
      tags: article.tags,
      haystack: [
        article.title,
        article.dek,
        article.tags.join(" "),
        category.name,
        category.title,
        author,
      ]
        .join(" ")
        .toLowerCase(),
    };
  });
}
