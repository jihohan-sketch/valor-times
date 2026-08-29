import { NextResponse } from "next/server";

import { articleExists, readVisitorId } from "@/lib/engagement/input";
import { removeComment, toPublic } from "@/lib/engagement/store";

/** A reader can delete their own comment — the one thing their browser id buys them. */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { slug, id } = await params;
  if (!articleExists(slug)) {
    return NextResponse.json({ error: "No such story." }, { status: 404 });
  }

  const payload = await request.json().catch(() => null);
  const visitorId = readVisitorId((payload as { visitorId?: unknown })?.visitorId);
  if (!visitorId) {
    return NextResponse.json({ error: "Missing reader id." }, { status: 400 });
  }

  const { entry, removed } = removeComment(slug, id, visitorId);
  if (!removed) {
    return NextResponse.json({ error: "That comment is not yours." }, { status: 403 });
  }

  return NextResponse.json(toPublic(slug, entry, visitorId), {
    headers: { "cache-control": "no-store" },
  });
}
