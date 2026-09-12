import { getAllArticles } from "@/data";
import { BODY_MAX, NAME_MAX } from "@/lib/engagement/limits";
import { createRateLimiter } from "@/lib/rate-limit";

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
 * How often one reader may post.
 *
 * The visitor id cannot carry this on its own. It is a string the browser
 * mints and the browser sends, so a script that wants to flood a thread just
 * puts a new one in every request and never sees a cooldown at all — the
 * guard was reading the attacker's own claim about who they were. The limit
 * that means anything is keyed on the address the request came from, which
 * the caller does not get to choose.
 *
 * The per-browser cooldown stays, above the other one. It is not a defence and
 * is not asked to be: it is what stops a double-tap on Post from filing the
 * same comment twice, and it answers before the harsher limit is charged.
 */
const COMMENT_COOLDOWN_MS = 20 * 1000;
const lastComment = new Map<string, number>();

const commentLimiter = createRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000,
  blockMs: 10 * 60 * 1000,
});

export function commentTooSoon(ip: string, visitorId: string): boolean {
  const now = Date.now();
  const last = lastComment.get(visitorId);
  if (last !== undefined && now - last < COMMENT_COOLDOWN_MS) return true;

  if (lastComment.size > 5000) {
    for (const [id, seen] of lastComment) {
      if (now - seen > COMMENT_COOLDOWN_MS) lastComment.delete(id);
    }
  }

  if (!commentLimiter.hit(ip).ok) return true;

  lastComment.set(visitorId, now);
  return false;
}
