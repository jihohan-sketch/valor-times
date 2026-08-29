import { NextResponse } from "next/server";

import { countsFor } from "@/lib/engagement/store";

/** Counts only, in one round trip, so a page of cards costs a single request. */
export async function GET(request: Request) {
  const param = new URL(request.url).searchParams.get("slugs") ?? "";
  const slugs = [
    ...new Set(
      param
        .split(",")
        .map((slug) => slug.trim())
        .filter(Boolean),
    ),
  ].slice(0, 60);

  return NextResponse.json(
    { counts: countsFor(slugs) },
    { headers: { "cache-control": "no-store" } },
  );
}
