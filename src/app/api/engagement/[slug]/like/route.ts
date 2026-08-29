import { NextResponse } from "next/server";

import { articleExists, readVisitorId } from "@/lib/engagement/input";
import { toPublic, toggleLike } from "@/lib/engagement/store";

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

  return NextResponse.json(toPublic(slug, toggleLike(slug, visitorId), visitorId), {
    headers: { "cache-control": "no-store" },
  });
}
