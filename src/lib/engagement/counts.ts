/**
 * View counts for cards, fetched once for the whole screen.
 *
 * Every counter that mounts drops its slug into a pending set; the set is
 * flushed on the next tick as a single request. A page of forty cards costs
 * one round trip, not forty.
 */

export interface Counts {
  views: number;
  likes: number;
  comments: number;
}

const cache = new Map<string, Counts>();
const waiting = new Map<string, ((counts: Counts) => void)[]>();
let scheduled = false;

async function flush() {
  scheduled = false;
  const slugs = [...waiting.keys()];
  if (slugs.length === 0) return;

  const pending = new Map(waiting);
  waiting.clear();

  try {
    const response = await fetch(`/api/engagement?slugs=${slugs.map(encodeURIComponent).join(",")}`);
    if (!response.ok) throw new Error(String(response.status));
    const { counts } = (await response.json()) as { counts: Record<string, Counts> };

    for (const [slug, listeners] of pending) {
      const entry = counts[slug] ?? { views: 0, likes: 0, comments: 0 };
      cache.set(slug, entry);
      for (const listener of listeners) listener(entry);
    }
  } catch {
    // Counts are decoration around the journalism; a failure shows nothing.
  }
}

export function fetchCounts(slug: string, onResult: (counts: Counts) => void) {
  const cached = cache.get(slug);
  if (cached) {
    onResult(cached);
    return;
  }

  waiting.set(slug, [...(waiting.get(slug) ?? []), onResult]);
  if (!scheduled) {
    scheduled = true;
    setTimeout(flush, 0);
  }
}

/** After a like or a comment, the card counts on the next screen are stale. */
export function primeCounts(slug: string, counts: Counts) {
  cache.set(slug, counts);
}

export function forgetCounts() {
  cache.clear();
}

const decimal = new Intl.NumberFormat("en-US");

/** 1,204 up to a thousand, then 1.2k — a count should never break a meta line. */
export function formatCount(value: number): string {
  if (value < 10_000) return decimal.format(value);
  if (value < 1_000_000) return `${(value / 1000).toFixed(value < 100_000 ? 1 : 0)}k`;
  return `${(value / 1_000_000).toFixed(1)}m`;
}
