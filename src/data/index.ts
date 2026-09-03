import { applyCms, readStore } from "@/lib/cms/store";

import {
  articleOfTheWeek,
  PINNED_ARTICLE,
  weekNumber,
} from "./article-of-the-week";
import { articles } from "./articles";
import { authorBySlug, authors } from "./authors";
import {
  categories,
  categoryBySlug,
  primaryCategories,
  secondaryCategories,
} from "./categories";
import { aspectOf, imageSizes } from "./image-sizes";
import { issueBySlug, issuePages, issues } from "./issues";
import { isPlate } from "./plate";
import {
  masthead,
  mastheadBio,
  mastheadCount,
  mastheadIssueSlug,
} from "./masthead";
import type {
  Article,
  Author,
  Category,
  CategorySlug,
  Issue,
  MastheadGroup,
  MastheadMember,
} from "./types";

export {
  PINNED_ARTICLE,
  weekNumber,
  aspectOf,
  imageSizes,
  isPlate,
  articles,
  authors,
  categories,
  authorBySlug,
  categoryBySlug,
  primaryCategories,
  secondaryCategories,
  issues,
  issueBySlug,
  issuePages,
  masthead,
  mastheadBio,
  mastheadCount,
  mastheadIssueSlug,
};
export type {
  Article,
  Author,
  Category,
  CategorySlug,
  Issue,
  MastheadGroup,
  MastheadMember,
};

const byNewest = (a: Article, b: Article) => b.date.localeCompare(a.date);

/** Seed catalog plus whatever the newsroom desk has saved. */
export function getAllArticles(): Article[] {
  return applyCms(articles, readStore());
}

export function getArticle(slug: string): Article | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getAuthor(slug: string): Author | undefined {
  return authorBySlug[slug];
}

export function authorName(article: Article): string {
  return authorBySlug[article.authorSlug]?.name ?? "Valor Times Staff";
}

export function getByCategory(slug: CategorySlug, limit?: number): Article[] {
  const list = getAllArticles().filter((article) => article.category === slug);
  return limit ? list.slice(0, limit) : list;
}

export function getByAuthor(slug: string, limit?: number): Article[] {
  const list = getAllArticles().filter((article) => article.authorSlug === slug);
  return limit ? list.slice(0, limit) : list;
}

/**
 * The pick of the week, printed in its own band on the front page.
 *
 * Turns over every Monday on its own — see `article-of-the-week.ts` for the
 * rotation and for the pin that overrides it. Undefined if nothing in the
 * catalogue is eligible, so the section can stand down rather than the page
 * erroring on an empty pool.
 *
 * `now` is injectable so the rotation can be tested and so a caller can ask
 * what next week holds; it defaults to the current instant.
 */
export function getArticleOfTheWeek(now?: number | Date): Article | undefined {
  return articleOfTheWeek(getAllArticles(), now);
}

/** The story the front page opens on, before the rotation takes over. */
export function getHero(): Article {
  return getHeroRotation(1)[0];
}

/**
 * The stories the front page rotates through: everything the desk marked
 * featured, newest first, topped up with the newest of whatever else there is
 * so the cover never falls back to a single static story.
 */
export function getHeroRotation(limit = 4): Article[] {
  const catalog = getAllArticles();
  const featured = catalog.filter((article) => article.featured);
  const rotation = featured.length >= 2 ? featured : catalog;
  return rotation.slice(0, Math.max(1, limit));
}

export function getLatest(limit: number, exclude: string[] = []): Article[] {
  return getAllArticles()
    .filter((article) => !exclude.includes(article.slug))
    .slice(0, limit);
}

/**
 * The desk's chosen run, in the desk's own order.
 *
 * Named for what it is. The site has live view counts, but nothing on this list
 * is decided by them — the ranking is `editorsRank`, typed by an editor — so
 * calling the section "Trending" would be a claim the data does not support.
 */
export function getEditorsPicks(limit = 12): Article[] {
  return getAllArticles()
    .filter((article) => typeof article.editorsRank === "number")
    .sort((a, b) => (a.editorsRank ?? 99) - (b.editorsRank ?? 99))
    .slice(0, limit);
}

export function getFeatured(limit = 6, exclude: string[] = []): Article[] {
  return getAllArticles()
    .filter((article) => article.featured && !exclude.includes(article.slug))
    .slice(0, limit);
}

/** Position in the reverse-chronological run, for previous / next links. */
export function getSiblings(article: Article): {
  previous?: Article;
  next?: Article;
} {
  const catalog = getAllArticles();
  const index = catalog.findIndex((entry) => entry.slug === article.slug);
  return {
    previous: index > 0 ? catalog[index - 1] : undefined,
    next: index < catalog.length - 1 ? catalog[index + 1] : undefined,
  };
}

/** Same category first, then shared tags, then whatever is newest. */
export function getRelated(article: Article, limit = 3): Article[] {
  return getAllArticles()
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) =>
        article.tags.includes(tag),
      ).length;
      const score =
        (candidate.category === article.category ? 10 : 0) + sharedTags * 3;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || byNewest(a.candidate, b.candidate))
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

/** Matches on title, dek, tags, category name, author name and body copy. */
export function searchArticles(query: string): Article[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return getAllArticles()
    .map((article) => {
      const author = authorBySlug[article.authorSlug]?.name ?? "";
      const category = categoryBySlug[article.category];
      const haystacks = [
        { text: article.title.toLowerCase(), weight: 6 },
        { text: article.dek.toLowerCase(), weight: 3 },
        { text: article.tags.join(" ").toLowerCase(), weight: 3 },
        {
          text: `${category.name} ${category.title} ${author}`.toLowerCase(),
          weight: 2,
        },
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
