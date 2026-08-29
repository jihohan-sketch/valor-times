import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

/**
 * Reader engagement — views, likes and comments — kept in the same shape as
 * the newsroom CMS store next door: a single JSON file, memoised on
 * `globalThis` so a serverless instance answers from memory and only touches
 * the disk on write. Nobody signs in for any of this; a reader is a random id
 * their own browser minted and keeps, which is enough to let them take a like
 * back or delete their own comment, and nothing more.
 */

export interface StoredComment {
  id: string;
  /** What the reader typed, or "Anonymous" when they left it blank. */
  name: string;
  body: string;
  /** ISO timestamp. */
  createdAt: string;
  /** The browser that wrote it, so that browser can delete it. Never sent out. */
  visitorId: string;
}

export interface ArticleEngagement {
  views: number;
  /** Visitor ids, so a like is a toggle rather than a counter that only climbs. */
  likes: string[];
  comments: StoredComment[];
}

export interface EngagementStore {
  version: 1;
  articles: Record<string, ArticleEngagement>;
}

/** What a reader is allowed to see about a comment. */
export interface PublicComment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
  /** True when this browser wrote it — the only reason the delete control shows. */
  mine: boolean;
}

export interface PublicEngagement {
  slug: string;
  views: number;
  likes: number;
  liked: boolean;
  comments: PublicComment[];
}

const STORE_PATH = path.join(process.cwd(), "data", "engagement.json");

type GlobalEngagement = typeof globalThis & { __valorTimesEngagement?: EngagementStore };

const emptyStore = (): EngagementStore => ({ version: 1, articles: {} });

const emptyEntry = (): ArticleEngagement => ({ views: 0, likes: [], comments: [] });

function isStore(value: unknown): value is EngagementStore {
  if (!value || typeof value !== "object") return false;
  const store = value as EngagementStore;
  return store.version === 1 && !!store.articles && typeof store.articles === "object";
}

export function readEngagement(): EngagementStore {
  const global = globalThis as GlobalEngagement;
  if (global.__valorTimesEngagement) return global.__valorTimesEngagement;

  let store: EngagementStore;
  try {
    const parsed: unknown = JSON.parse(readFileSync(STORE_PATH, "utf8"));
    store = isStore(parsed) ? parsed : emptyStore();
  } catch {
    store = emptyStore();
  }
  global.__valorTimesEngagement = store;
  return store;
}

function writeEngagement(store: EngagementStore) {
  (globalThis as GlobalEngagement).__valorTimesEngagement = store;
  mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  try {
    writeFileSync(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`);
  } catch {
    // Serverless filesystems are often read-only; the in-memory copy still
    // serves this instance, exactly as the CMS store does.
  }
  return store;
}

/** Reads an entry without creating one, so a GET never grows the file. */
export function entryFor(slug: string): ArticleEngagement {
  return readEngagement().articles[slug] ?? emptyEntry();
}

/** Mutates one article's entry and persists the result. */
function update(slug: string, change: (entry: ArticleEngagement) => ArticleEngagement) {
  const store = readEngagement();
  const next = change(store.articles[slug] ?? emptyEntry());
  return writeEngagement({
    version: 1,
    articles: { ...store.articles, [slug]: next },
  }).articles[slug];
}

/**
 * A view is one reader arriving at one story. The browser only asks once per
 * tab, and this cooldown catches the rest — a refresh loop, a back-and-forth,
 * a second tab — so the number means readers rather than requests.
 */
const VIEW_COOLDOWN_MS = 30 * 60 * 1000;
const recentViews = new Map<string, number>();

export function recordView(slug: string, visitorId: string): ArticleEngagement {
  const key = `${slug}::${visitorId}`;
  const now = Date.now();
  const last = recentViews.get(key);

  if (last !== undefined && now - last < VIEW_COOLDOWN_MS) return entryFor(slug);

  // Cheap sweep so the map cannot grow without bound on a long-lived instance.
  if (recentViews.size > 5000) {
    for (const [entry, seen] of recentViews) {
      if (now - seen > VIEW_COOLDOWN_MS) recentViews.delete(entry);
    }
  }
  recentViews.set(key, now);

  return update(slug, (entry) => ({ ...entry, views: entry.views + 1 }));
}

export function toggleLike(slug: string, visitorId: string): ArticleEngagement {
  return update(slug, (entry) => ({
    ...entry,
    likes: entry.likes.includes(visitorId)
      ? entry.likes.filter((id) => id !== visitorId)
      : [...entry.likes, visitorId],
  }));
}

export function addComment(
  slug: string,
  comment: Omit<StoredComment, "id" | "createdAt">,
): ArticleEngagement {
  const stored: StoredComment = {
    ...comment,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  return update(slug, (entry) => ({ ...entry, comments: [...entry.comments, stored] }));
}

/** Only the browser that wrote a comment can remove it. */
export function removeComment(
  slug: string,
  id: string,
  visitorId: string,
): { entry: ArticleEngagement; removed: boolean } {
  const existing = entryFor(slug).comments.find((comment) => comment.id === id);
  if (!existing || existing.visitorId !== visitorId) {
    return { entry: entryFor(slug), removed: false };
  }
  const entry = update(slug, (current) => ({
    ...current,
    comments: current.comments.filter((comment) => comment.id !== id),
  }));
  return { entry, removed: true };
}

/** Strips visitor ids and sorts comments newest last, the way a thread reads. */
export function toPublic(
  slug: string,
  entry: ArticleEngagement,
  visitorId: string,
): PublicEngagement {
  return {
    slug,
    views: entry.views,
    likes: entry.likes.length,
    liked: entry.likes.includes(visitorId),
    comments: [...entry.comments]
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(({ id, name, body, createdAt, visitorId: author }) => ({
        id,
        name,
        body,
        createdAt,
        mine: author === visitorId && visitorId !== "",
      })),
  };
}

/** View and comment counts for a set of slugs, for cards and rankings. */
export function countsFor(slugs: string[]) {
  const store = readEngagement();
  return Object.fromEntries(
    slugs.map((slug) => {
      const entry = store.articles[slug] ?? emptyEntry();
      return [
        slug,
        { views: entry.views, likes: entry.likes.length, comments: entry.comments.length },
      ];
    }),
  );
}
