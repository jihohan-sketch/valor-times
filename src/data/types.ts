/** Shared content types. Everything the site renders flows through these. */

export type CategorySlug =
  | "news"
  | "social-issues"
  | "culture"
  | "opinions"
  | "cuisine"
  | "health-science"
  | "psychology"
  | "comics";

/** How a homepage section chooses to present its category. */
export type SectionLayout =
  | "split"     // dominant feature beside a numbered stack
  | "list"      // editorial list on a tinted ground, one plate
  | "rail"      // horizontal carousel of portrait image cards
  | "quotes"    // horizontal carousel of text-only argument cards
  | "pinned"    // a pinned feature with a horizontal rail beside it
  | "feature"   // a single giant story with a supporting index
  | "index"     // numbered typographic index, no artwork
  | "gallery";  // oversized artwork carousel on a dark ground

export interface Category {
  slug: CategorySlug;
  /** Short label used in navigation and on cards. */
  name: string;
  /** Full name used as the section and category-page headline. */
  title: string;
  /** One line that sits under the section headline. */
  description: string;
  /** Two-word standfirst printed beside the section rule. */
  kicker: string;
  /** Chosen homepage presentation. Keeps every section visually distinct. */
  layout: SectionLayout;
  /** Shown in the nav's primary row rather than the More menu. */
  primaryNav?: boolean;
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
  /** Path or URL. Leave empty for a text-only story — layouts adapt. */
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
