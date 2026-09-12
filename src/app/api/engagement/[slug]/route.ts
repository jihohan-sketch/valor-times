import { NextResponse } from "next/server";

import { articleExists, readVisitorId } from "@/lib/engagement/input";
import { entryFor, recordView, toPublic } from "@/lib/engagement/store";
import { createRateLimiter } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request-ip";

const noStore = { headers: { "cache-control": "no-store" } };

/**
 * The per-reader view cooldown is keyed on the visitor id the browser sends,
 * which a script simply rotates. This is the ceiling that does not depend on
 * the caller being honest about who they are: sixty stories opened in ten
 * minutes is more than anyone reads and less than anyone inflates a counter
 * with.
 */
const viewLimiter = createRateLimiter({
  limit: 60,
  windowMs: 10 * 60 * 1000,
  blockMs: 10 * 60 * 1000,
});

/** Everything one story's engagement panel needs, for a reader who is anonymous. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!articleExists(slug)) {
    return NextResponse.json({ error: "No such story." }, { status: 404 });
  }

  const visitorId = readVisitorId(new URL(request.url).searchParams.get("visitor")) ?? "";
  return NextResponse.json(toPublic(slug, entryFor(slug), visitorId), noStore);
}

/** The reader arrived. Counts the view, then returns the same panel payload. */
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

  const limit = viewLimiter.hit(clientIp(request));
  if (!limit.ok) {
    // The panel still renders; the arrival simply is not counted.
    return NextResponse.json(toPublic(slug, entryFor(slug), visitorId), noStore);
  }

  return NextResponse.json(toPublic(slug, recordView(slug, visitorId), visitorId), noStore);
}
