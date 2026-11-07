import { weekNumber } from "./article-of-the-week";
import type { Article } from "./types";

/**
 * Editor's Picks, and how it changes.
 *
 * The list used to be ranked by hand through `editorsRank`, which meant it only
 * changed when someone remembered to retype the numbers. It now deals itself a
 * fresh hand every Monday, on the same UTC week as the Article of the Week (see
 * `weekNumber`): the pool is shuffled with the week's number as the seed, so
 * every reader sees the same list all week and a different one the next.
 *
 * The desk can choose the list outright — see `HAND_PICKED` — or set a single
 * week to one issue — see `PINNED_WEEKS`.
 */

/**
 * The editors' own list, in the order to print it. Each entry is a story's
 * slug, the last part of its address (e.g. "before-sunrise" for
 * /article/before-sunrise). When this has anything in it, it IS the list —
 * every week, until it is edited — and the page says the editors chose it.
 * Leave it empty to fall back to the weekly rotation below. Unknown slugs are
 * skipped.
 */
/* Typed wider than its value so adding the first slug is a one-line change. */
export const HAND_PICKED: string[] = [];

/** How this week's list was made, so the page can describe it truthfully. */
export type PicksMode = "hand-picked" | "issue" | "rotation";

export function picksMode(catalog: Article[], now: number | Date = Date.now()): PicksMode {
  if (HAND_PICKED.some((slug) => catalog.some((article) => article.slug === slug))) {
    return "hand-picked";
  }
  const pinned = PINNED_WEEKS[weekNumber(now)];
  if (pinned && catalog.some((article) => article.issueSlug === pinned)) return "issue";
  return "rotation";
}

/**
 * Weeks the desk has chosen for itself: in that week, and only that week, the
 * list is every story from the named issue in the order it was printed. Keyed
 * by `weekNumber`. Once the week passes the entry does nothing and can be
 * deleted; an issue slug with no stories falls back to the shuffle.
 */
export const PINNED_WEEKS: Record<number, string> = {
  /* Mon 19 Oct – Sun 25 Oct 2026: the week Vol4. No11 went up. */
  41: "vol4-no11",
};

/**
 * Shortest body worth a place on the list. Same bar as the Article of the Week:
 * it keeps the one-line photo dumps from taking a slot in a random week. A
 * pinned issue is shown whole regardless.
 */
const MIN_BODY = 600;

function isEligible(article: Article): boolean {
  return Boolean(article.image) && article.content.length >= MIN_BODY;
}

/** FNV-1a, so the shuffle is identical on every machine and every deploy. */
function hash(text: string): number {
  let value = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 0x01000193);
  }
  return value >>> 0;
}

/**
 * The week's list. A pinned week prints its issue in page order; any other week
 * sorts the eligible catalogue by a hash of slug and week number — random-looking,
 * but fixed for the week, so a reload never reshuffles it.
 */
export function editorsPicks(
  catalog: Article[],
  limit: number,
  now: number | Date = Date.now(),
): Article[] {
  const chosen = HAND_PICKED.map((slug) =>
    catalog.find((article) => article.slug === slug),
  ).filter((article): article is Article => Boolean(article));
  if (chosen.length > 0) return chosen.slice(0, limit);

  const week = weekNumber(now);

  const pinnedIssue = PINNED_WEEKS[week];
  if (pinnedIssue) {
    const issue = catalog
      .filter((article) => article.issueSlug === pinnedIssue)
      .sort((a, b) => a.page - b.page);
    if (issue.length > 0) return issue.slice(0, limit);
  }

  return catalog
    .filter(isEligible)
    .map((article) => ({ article, key: hash(`${week}:${article.slug}`) }))
    .sort((a, b) => a.key - b.key)
    .slice(0, limit)
    .map((entry) => entry.article);
}
