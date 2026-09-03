import type { Article } from "./types";

/**
 * The one story the desk holds up on the front page, and how it changes.
 *
 * The pick used to be a single hand-typed slug, which meant it only ever
 * changed when someone remembered to edit this file. It now turns over on its
 * own every Monday: the eligible catalogue is dealt into a fixed order, and the
 * week's number picks out of it. Same story all week for every reader, a new
 * one on Monday, and no repeat until the whole pool has had its turn.
 *
 * The desk can still overrule the rotation — see `PINNED_ARTICLE`.
 */

/**
 * Set to a slug to freeze the band on one story indefinitely; leave empty to
 * let the weekly rotation run. Overrides the rotation entirely, so it is for
 * the week the desk actually wants to argue about something, not for ordinary
 * weeks. An unrecognised slug is ignored and the rotation carries on.
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
 * Featured stories are excluded because they are already the cover rotation
 * directly above it, and the front page should not print the same story twice
 * in its first two screens. Plates are not excluded — the band mounts a printed
 * page in a frame rather than cropping it, which is more than most sections
 * do — so the only other bars are having artwork at all and having enough body
 * to fill the teaser. In practice that bar is what keeps the Bible strips and
 * the photo dumps out.
 */
export function isEligible(article: Article): boolean {
  return (
    !article.featured &&
    Boolean(article.image) &&
    article.content.length >= MIN_BODY
  );
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
 * The eligible catalogue in the order it will be printed, one story a week.
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
 * The order is derived from the catalogue rather than stored, so publishing a
 * story adds it to the rotation with no edit here. It also means a new story
 * can shift which week the remaining picks land on — the cycle is a rotation,
 * not a calendar the desk can promise dates against.
 */
export function rotationOrder(catalog: Article[]): Article[] {
  const pool = catalog
    .filter(isEligible)
    .sort((a, b) => hash(a.slug) - hash(b.slug));

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
 * that still exists; otherwise the week's number indexes the rotation, wrapping
 * round when the pool runs out. Undefined only if nothing at all is eligible,
 * so the homepage can stand the section down rather than error.
 */
export function articleOfTheWeek(
  catalog: Article[],
  now: number | Date = Date.now(),
): Article | undefined {
  if (PINNED_ARTICLE) {
    const pinned = catalog.find((article) => article.slug === PINNED_ARTICLE);
    if (pinned) return pinned;
  }

  const order = rotationOrder(catalog);
  if (order.length === 0) return undefined;

  const week = weekNumber(now);
  return order[((week % order.length) + order.length) % order.length];
}
