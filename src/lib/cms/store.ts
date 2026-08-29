import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

import type { Article } from "@/data/types";

export interface CmsStore {
  version: 1;
  deleted: string[];
  articles: Article[];
}

const STORE_PATH = path.join(process.cwd(), "data", "cms.json");

type GlobalCms = typeof globalThis & { __valorTimesCms?: CmsStore };

function emptyStore(): CmsStore {
  return { version: 1, deleted: [], articles: [] };
}

function isStore(value: unknown): value is CmsStore {
  if (!value || typeof value !== "object") return false;
  const store = value as CmsStore;
  return store.version === 1 && Array.isArray(store.deleted) && Array.isArray(store.articles);
}

export function readStore(): CmsStore {
  const global = globalThis as GlobalCms;
  if (global.__valorTimesCms) return global.__valorTimesCms;

  try {
    const parsed: unknown = JSON.parse(readFileSync(STORE_PATH, "utf8"));
    const store = isStore(parsed) ? parsed : emptyStore();
    global.__valorTimesCms = store;
    return store;
  } catch {
    const store = emptyStore();
    global.__valorTimesCms = store;
    return store;
  }
}

export function writeStore(store: CmsStore) {
  const next: CmsStore = {
    version: 1,
    deleted: [...new Set(store.deleted)],
    articles: store.articles,
  };
  (globalThis as GlobalCms).__valorTimesCms = next;
  mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  try {
    writeFileSync(STORE_PATH, `${JSON.stringify(next, null, 2)}\n`);
  } catch {
    // Serverless filesystems are often read-only; the in-memory copy still serves this instance.
  }
  return next;
}

export function applyCms(seed: Article[], store: CmsStore): Article[] {
  const deleted = new Set(store.deleted);
  const bySlug = new Map<string, Article>();

  for (const article of seed) {
    if (!deleted.has(article.slug)) bySlug.set(article.slug, article);
  }
  for (const article of store.articles) {
    if (!deleted.has(article.slug)) bySlug.set(article.slug, article);
  }

  return [...bySlug.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export function upsertArticle(article: Article) {
  const store = readStore();
  const deleted = store.deleted.filter((slug) => slug !== article.slug);
  const articles = store.articles.filter((entry) => entry.slug !== article.slug);
  articles.push(article);
  return writeStore({ version: 1, deleted, articles });
}

export function deleteArticle(slug: string) {
  const store = readStore();
  return writeStore({
    version: 1,
    deleted: [...store.deleted, slug],
    articles: store.articles.filter((article) => article.slug !== slug),
  });
}
