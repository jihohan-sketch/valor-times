/**
 * Who a reader is, as far as this site is concerned: a random id their own
 * browser minted and kept. Nobody signs in. The id never identifies a person —
 * it only lets the same browser take a like back and delete its own comment.
 * Clear the browser's storage and the reader is simply someone new.
 */

const ID_KEY = "vt.reader";
const NAME_KEY = "vt.reader.name";

function mint(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Stable per browser. Falls back to a per-tab id when storage is blocked. */
let memoryId: string | null = null;

export function visitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = window.localStorage.getItem(ID_KEY);
    if (stored) return stored;
    const fresh = mint();
    window.localStorage.setItem(ID_KEY, fresh);
    return fresh;
  } catch {
    memoryId ??= mint();
    return memoryId;
  }
}

/** The name a reader last signed a comment with, so they need not retype it. */
export function readerName(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function rememberName(name: string) {
  try {
    if (name.trim()) window.localStorage.setItem(NAME_KEY, name.trim());
    else window.localStorage.removeItem(NAME_KEY);
  } catch {
    // Storage blocked; the name simply will not persist.
  }
}

/** True the first time this tab opens a given story — the view-count guard. */
export function firstVisitThisSession(slug: string): boolean {
  try {
    const key = `vt.seen.${slug}`;
    if (window.sessionStorage.getItem(key)) return false;
    window.sessionStorage.setItem(key, "1");
    return true;
  } catch {
    return true;
  }
}
