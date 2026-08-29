import { articles } from "./articles";
import { authorBySlug, authors } from "./authors";
import { categories, categoryBySlug } from "./categories";
import type { Article, Author, Category, CategorySlug } from "./types";

export { articles, authors, categories, authorBySlug, categoryBySlug };
export type { Article, Author, Category, CategorySlug };

const byNewest = (a: Article, b: Article) => b.date.localeCompare(a.date);

/** Every article, newest first. This is the list every other query starts from. */
export const allArticles: Article[] = [...articles].sort(byNewest);

export function getArticle(slug: string): Article | undefined {
  return allArticles.find((article) => article.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getAuthor(slug: string): Author | undefined {
  return authorBySlug[slug];
}

export function getByCategory(slug: CategorySlug, limit?: number): Article[] {
  const list = allArticles.filter((article) => article.category === slug);
  return limit ? list.slice(0, limit) : list;
}

/** The lead story: the newest featured article, or simply the newest. */
export function getHero(): Article {
  return allArticles.find((article) => article.featured) ?? allArticles[0];
}

export function getLatest(limit: number, exclude: string[] = []): Article[] {
  return allArticles
    .filter((article) => !exclude.includes(article.slug))
    .slice(0, limit);
}

export function getTrending(limit = 6): Article[] {
  return allArticles
    .filter((article) => typeof article.trendingRank === "number")
    .sort((a, b) => (a.trendingRank ?? 99) - (b.trendingRank ?? 99))
    .slice(0, limit);
}

export function getFeatured(limit = 4, exclude: string[] = []): Article[] {
  return allArticles
    .filter((article) => article.featured && !exclude.includes(article.slug))
    .slice(0, limit);
}

/** Same category first, then shared tags, then whatever is newest. */
export function getRelated(article: Article, limit = 3): Article[] {
  const scored = allArticles
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) =>
        article.tags.includes(tag),
      ).length;
      const score =
        (candidate.category === article.category ? 10 : 0) + sharedTags * 3;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || byNewest(a.candidate, b.candidate));

  return scored.slice(0, limit).map((entry) => entry.candidate);
}

export function searchArticles(query: string): Article[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return allArticles
    .map((article) => {
      const author = authorBySlug[article.authorSlug]?.name ?? "";
      const haystacks = [
        { text: article.title.toLowerCase(), weight: 6 },
        { text: article.dek.toLowerCase(), weight: 3 },
        { text: article.tags.join(" ").toLowerCase(), weight: 3 },
        { text: `${categoryBySlug[article.category].name} ${author}`.toLowerCase(), weight: 2 },
        { text: article.content.toLowerCase(), weight: 1 },
      ];

      const score = terms.reduce((total, term) => {
        const hit = haystacks.reduce(
          (sum, { text, weight }) => sum + (text.includes(term) ? weight : 0),
          0,
        );
        return hit === 0 ? total : total + hit;
      }, 0);

      const matchesEvery = terms.every((term) =>
        haystacks.some(({ text }) => text.includes(term)),
      );

      return { article, score: matchesEvery ? score : 0 };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || byNewest(a.article, b.article))
    .map((entry) => entry.article);
}
