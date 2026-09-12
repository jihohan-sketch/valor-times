import { NextResponse } from "next/server";

import { articleExists, readVisitorId } from "@/lib/engagement/input";
import { toPublic, toggleLike } from "@/lib/engagement/store";
import { createRateLimiter } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request-ip";

/**
 * A like is stored as the visitor id that cast it, so the toggle works and a
 * reader can take one back. That also means every fresh id a caller invents is
 * a new entry in a list that only grows, in a file that is rewritten whole on
 * every write — so the ceiling on invented ids has to come from somewhere the
 * caller does not control. Thirty toggles in ten minutes is far more than
 * reading the paper takes and far less than stuffing a ballot needs.
 */
const likeLimiter = createRateLimiter({
  limit: 30,
  windowMs: 10 * 60 * 1000,
  blockMs: 10 * 60 * 1000,
});

/** Likes toggle, so a reader can take one back. No account, just their browser. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!articleExists(slug)) {
    return NextResponse.json({ error: "No such story." }, { status: 404 });
  }

  const payload = await request.json().catch(() => null);
  const visitorId = readVisitorId((payload as { visitorId?: unknown })?.visitorId);
  if (!visitorId) {
    return NextResponse.json({ error: "Missing reader id." }, { status: 400 });
  }

  const limit = likeLimiter.hit(clientIp(request));
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Slow down a moment." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  return NextResponse.json(toPublic(slug, toggleLike(slug, visitorId), visitorId), {
    headers: { "cache-control": "no-store" },
  });
}
