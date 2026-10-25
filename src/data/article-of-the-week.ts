import { issues as printedIssues } from "./issues";
import type { Article, Issue } from "./types";

/**
 * The one story the desk holds up on the front page, and how it changes.
 *
 * The pick always comes from the newest issue. It used to rotate through the
 * whole back catalogue, which meant the front page could spend a week holding
 * up a story from last December while a new issue sat unread above it. Now the
 * pool is the current issue's stories and nothing older, so publishing a new
 * issue moves the band on to it with no edit here.
 *
 * Inside that issue it turns over every Monday: the eligible stories are dealt
 * into a fixed order and the week's number picks out of it. Same story all
 * week for every reader, a new one on Monday.
 *
 * The desk can still choose the story by hand — see `PINNED_ARTICLE`.
 */

/**
 * Set to a slug to put one story in the band; leave empty to let the weekly
 * rotation run. The slug is the last part of the story's address, e.g.
 * "valor-2026-retreat" for /article/valor-2026-retreat.
 *
 * A pin only holds while its story is in the newest issue. Once the next issue
 * comes out the pin lapses on its own and the rotation picks from the new
 * issue, so a forgotten pin cannot leave an old story on the front page. An
 * unrecognised slug is ignored the same way.
 */
/* Typed wider than its value so editing it in is a one-word change. */
export const PINNED_ARTICLE: string = "";

/**
 * A Monday. Weeks are counted from here in UTC, matching the rest of the site
 * (see `lib/format`), so the pick turns over at the same instant for every
 * reader rather than at each one's local midnight.
 */
const EPOCH = Date.UTC(2026, 0, 5);

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Shortest body worth giving the band to. The section prints an opening
 * paragraph under a red rule, and a story with two lines in it leaves that rule
 * hanging over nothing — the photo dumps and the one-line listicles are real
 * stories, they just do not carry a whole band on their own.
 */
const MIN_BODY = 600;

/** Whole weeks since `EPOCH`. Negative dates count backwards, hence the floor. */
export function weekNumber(now: number | Date = Date.now()): number {
  const ms = (now instanceof Date ? now.getTime() : now) - EPOCH;
  return Math.floor(ms / WEEK_MS);
}

/**
 * Whether a story can carry the band.
 *
 * The Comics & Bible desk is left out by name: a strip is not an article, and
 * the body-length bar alone let the longer ones through. Other plates are not
 * excluded — the band mounts a printed page in a frame rather than cropping
 * it — so the remaining bars are having artwork at all and having enough body
 * to fill the teaser, which is what keeps the photo dumps out.
 */
export function isEligible(article: Article): boolean {
  return (
    article.category !== "comics" &&
    Boolean(article.image) &&
    article.content.length >= MIN_BODY
  );
}

/**
 * The stories the band chooses from: the newest issue's eligible stories,
 * minus its opening story, which the cover directly above already leads on.
 *
 * "Newest issue" is the first issue in print order with anything eligible
 * filed under it — normally the latest one. An issue whose only eligible story
 * is its lead keeps that lead rather than giving the band to an older issue.
 */
export function currentIssuePool(
  catalog: Article[],
  issues: Issue[] = printedIssues,
): Article[] {
  for (const issue of issues) {
    const stories = catalog
      .filter((article) => article.issueSlug === issue.slug)
      .sort((a, b) => a.page - b.page);
    const eligible = stories.filter(isEligible);
    if (eligible.length === 0) continue;
    const [lead] = stories;
    const rest = eligible.filter((article) => article.slug !== lead.slug);
    return rest.length > 0 ? rest : eligible;
  }
  return [];
}

/** FNV-1a, so the order below is stable across machines and deploys. */
function hash(text: string): number {
  let value = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 0x01000193);
  }
  return value >>> 0;
}

/**
 * A pool of stories in the order it will be printed, one story a week.
 *
 * Two passes. First the pool is sorted by a hash of the slug, which is
 * arbitrary but fixed — it breaks up the file order so the band does not spend
 * a month walking down the Culture desk in the order those stories happen to be
 * typed. Then the desks are interleaved by position rather than dealt in
 * rounds: each story is placed at its share of the way through its own desk's
 * run, and the whole lot is sorted on that. A desk holding a third of the
 * catalogue comes up about every third week for the length of the cycle,
 * instead of a round-robin's short polite opening followed by a long tail of
 * whichever desk files the most.
 *
 * The order is derived from the stories rather than stored, so publishing a
 * story adds it to the rotation with no edit here. It also means a new story
 * can shift which week the remaining picks land on — the cycle is a rotation,
 * not a calendar the desk can promise dates against.
 */
export function rotationOrder(stories: Article[]): Article[] {
  const pool = [...stories].sort((a, b) => hash(a.slug) - hash(b.slug));

  const desks = new Map<string, Article[]>();
  for (const article of pool) {
    const desk = desks.get(article.category);
    if (desk) desk.push(article);
    else desks.set(article.category, [article]);
  }

  /* Midpoints, not edges: a desk of one story sits at 0.5, in the middle of the
     cycle, rather than sharing the opening slot with every other desk. */
  const spread = new Map<string, number>();
  for (const hand of desks.values()) {
    hand.forEach((article, index) => {
      spread.set(article.slug, (index + 0.5) / hand.length);
    });
  }

  return pool.sort(
    (a, b) =>
      spread.get(a.slug)! - spread.get(b.slug)! || hash(a.slug) - hash(b.slug),
  );
}

/**
 * The story the band prints in a given week. The pin wins if it names a story
 * in the newest issue; otherwise the week's number indexes that issue's
 * rotation, wrapping round when the pool runs out. Undefined only if nothing
 * at all is eligible, so the homepage can stand the section down rather than
 * error.
 */
export function articleOfTheWeek(
  catalog: Article[],
  now: number | Date = Date.now(),
  issues: Issue[] = printedIssues,
): Article | undefined {
  const pool = currentIssuePool(catalog, issues);

  if (PINNED_ARTICLE) {
    const pinned = catalog.find((article) => article.slug === PINNED_ARTICLE);
    if (pinned && pinned.issueSlug === pool[0]?.issueSlug) return pinned;
  }

  const order = rotationOrder(pool);
  if (order.length === 0) return undefined;

  const week = weekNumber(now);
  return order[((week % order.length) + order.length) % order.length];
}
