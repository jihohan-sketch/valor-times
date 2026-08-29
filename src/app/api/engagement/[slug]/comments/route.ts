import { NextResponse } from "next/server";

import {
  articleExists,
  commentTooSoon,
  parseComment,
  readVisitorId,
} from "@/lib/engagement/input";
import { addComment, toPublic } from "@/lib/engagement/store";

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

  const parsed = parseComment(payload);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (commentTooSoon(visitorId)) {
    return NextResponse.json(
      { error: "Give it a moment before posting again." },
      { status: 429 },
    );
  }

  const entry = addComment(slug, { ...parsed, visitorId });
  return NextResponse.json(toPublic(slug, entry, visitorId), {
    status: 201,
    headers: { "cache-control": "no-store" },
  });
}
