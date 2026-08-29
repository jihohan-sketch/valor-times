import { NextResponse } from "next/server";

import { articleExists, readVisitorId } from "@/lib/engagement/input";
import { entryFor, recordView, toPublic } from "@/lib/engagement/store";

const noStore = { headers: { "cache-control": "no-store" } };

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

  return NextResponse.json(toPublic(slug, recordView(slug, visitorId), visitorId), noStore);
}
