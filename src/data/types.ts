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

/** One person as printed on the masthead page. */
export interface MastheadMember {
  /** Name exactly as printed. */
  name: string;
  /** Their entry in `authors`, so the site can reach what they filed. */
  slug: string;
}

/** One titled block of the printed masthead, e.g. JOURNALISTS. */
export interface MastheadGroup {
  /** The block's heading, in the paper's own wording. */
  role: string;
  members: MastheadMember[];
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
  /**
   * True when `image` is a clipping of the printed page — the headline and
   * type as they were set in the PDF — rather than a photograph. Those must be
   * shown whole: a clipping cropped to a landscape band cuts words in half.
   * Comics & Bible plates are covered by their category and need no flag.
   */
  plate?: boolean;
  tags: string[];
  /** Promotes the story into the homepage hero / featured rail. */
  featured?: boolean;
  /** Lower number = higher on the numbered trending list. Omit to exclude. */
  trendingRank?: number;
  /** The printed issue this ran in. */
  issueSlug: string;
  /** The page it was printed on, so the story can link back to the real page. */
  page: number;
  /**
   * Article body, transcribed from the printed page. The renderer understands
   * four line prefixes:
   *   "## "  section heading
   *   "> "   pull quote
   *   "- "   list item (consecutive items become one list)
   *   ""     everything else is a paragraph; blank lines separate blocks.
   */
  content: string;
}

/**
 * One printed issue of the paper, as it came off the Canva layout and out of
 * the PDF. Everything here is lifted from the file itself: `title` is the
 * masthead line, `cover` is page one rendered at full size, and `pages` are the
 * real pages in order. Nothing on an Issue is written for the website.
 */
export interface Issue {
  slug: string;
  /** Masthead line exactly as printed, e.g. "Vol4. No1." */
  title: string;
  volume: number;
  number: number;
  /**
   * ISO date used for sorting. The paper prints no publication date, so this is
   * the first of the month the issue's own contents place it in — see
   * `dateLabel`, which is what the site actually shows.
   */
  date: string;
  /** Month precision, because that is as far as the evidence goes. */
  dateLabel: string;
  /** The headline that leads page one. */
  lead: string;
  /** Page one, rendered whole. */
  cover: string;
  /** The photograph printed on page one, lifted out of the PDF. */
  coverPhoto: string;
  coverAlt: string;
  pageCount: number;
  /** Original file in the newsroom Drive folder. */
  driveUrl: string;
  /** Name of the PDF in Drive, which does not always match the masthead. */
  sourceFile: string;
  /** Set when the file name or PDF metadata disagrees with the masthead. */
  numberingNote?: string;
  /**
   * Set when pages of this issue were reprinted in another one and are filed
   * under that issue instead, so its contents list looks shorter than its page
   * count. Explains the gap rather than leaving a reader to wonder.
   */
  reprintNote?: string;
}
