import { getAllArticles } from "@/data";
import { BODY_MAX, NAME_MAX } from "@/lib/engagement/limits";

/**
 * Everything arriving from an anonymous reader, checked before it reaches the
 * store. There is no login, so the rules are the guardrail: a real story slug,
 * a plausible visitor id, a name and body inside sane limits, and a short
 * cooldown so one browser cannot flood a thread.
 */

/** Visitor ids are minted by the browser; accept only the shape we hand out. */
export function readVisitorId(value: unknown): string | null {
  return typeof value === "string" && /^[a-zA-Z0-9-]{8,64}$/.test(value) ? value : null;
}

export function articleExists(slug: string): boolean {
  return getAllArticles().some((article) => article.slug === slug);
}

export function parseComment(
  payload: unknown,
): { name: string; body: string } | { error: string } {
  if (!payload || typeof payload !== "object") return { error: "Nothing to post." };
  const { name, body } = payload as { name?: unknown; body?: unknown };

  const text = typeof body === "string" ? body.trim().replace(/\n{3,}/g, "\n\n") : "";
  if (text.length === 0) return { error: "Write something first." };
  if (text.length > BODY_MAX) {
    return { error: `Comments run to ${BODY_MAX} characters.` };
  }

  const author = typeof name === "string" ? name.trim().replace(/\s+/g, " ") : "";
  if (author.length > NAME_MAX) return { error: `Names run to ${NAME_MAX} characters.` };

  return { name: author || "Anonymous", body: text };
}

/**
 * One comment per browser per 20 seconds, held in memory. It is not a defence
 * against a determined script — it is the difference between a thread and a
 * stuck key.
 */
const COMMENT_COOLDOWN_MS = 20 * 1000;
const lastComment = new Map<string, number>();

export function commentTooSoon(visitorId: string): boolean {
  const now = Date.now();
  const last = lastComment.get(visitorId);
  if (last !== undefined && now - last < COMMENT_COOLDOWN_MS) return true;

  if (lastComment.size > 5000) {
    for (const [id, seen] of lastComment) {
      if (now - seen > COMMENT_COOLDOWN_MS) lastComment.delete(id);
    }
  }
  lastComment.set(visitorId, now);
  return false;
}
