/** Shared content types. Everything the site renders flows through these. */

export type CategorySlug =
  | "news"
  | "culture"
  | "opinions"
  | "science-psychology"
  | "cuisine"
  | "comics";

export interface Category {
  slug: CategorySlug;
  /** Short label used in navigation and on cards. */
  name: string;
  /** Longer name used as the category page headline. */
  title: string;
  description: string;
  /** Accent colour token applied to badges and rules on that section. */
  accent: "red" | "ink" | "clay" | "moss" | "indigo" | "amber";
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
}

export interface Article {
  slug: string;
  title: string;
  /** The standfirst / summary line under the headline. */
  dek: string;
  category: CategorySlug;
  authorSlug: string;
  /** ISO date, e.g. "2026-05-14". */
  date: string;
  image: string;
  imageAlt: string;
  tags: string[];
  /** Promotes the story into the homepage hero / featured rail. */
  featured?: boolean;
  /** Lower number = higher on the numbered trending list. Omit to exclude. */
  trendingRank?: number;
  /**
   * Article body. The renderer understands four line prefixes:
   *   "## "  section heading
   *   "> "   pull quote
   *   "- "   list item (consecutive items become one list)
   *   ""     everything else is a paragraph; blank lines separate blocks.
   */
  content: string;
}
