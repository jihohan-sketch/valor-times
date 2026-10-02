import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

import { getArticle } from "@/data";
import type { Article } from "@/data/types";
import { notifyNewArticles } from "@/lib/notify";

/**
 * Called by `.github/workflows/news-email.yml` once a production deployment has
 * gone live, with the slugs that deployment added. Stories filed in the data
 * files reach the site this way; stories filed through the admin API notify
 * from their own route.
 *
 * The workflow decides what is new (it diffs against the previous production
 * deployment); this route only confirms each slug is actually live on this
 * deployment, then sends one email for the lot. Locked with
 * NEWS_EMAIL_HOOK_SECRET, which the workflow holds as a GitHub secret.
 */

export const dynamic = "force-dynamic";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function authorized(request: Request) {
  const secret = process.env.NEWS_EMAIL_HOOK_SECRET ?? "";
  if (secret.length < 32) return false;
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return timingSafeEqual(digest(token), digest(secret));
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { slugs?: unknown } | null;
  const slugs = Array.isArray(body?.slugs)
    ? [...new Set(body.slugs.map((slug) => String(slug).trim()).filter(Boolean))]
    : [];
  if (!slugs.length) {
    return NextResponse.json({ error: "Send { slugs: string[] }." }, { status: 400 });
  }

  const live: Article[] = [];
  const missing: string[] = [];
  for (const slug of slugs) {
    const article = getArticle(slug);
    if (article) live.push(article);
    else missing.push(slug);
  }
  if (missing.length) {
    console.warn(`[news-email] not live on this deployment, left out: ${missing.join(", ")}`);
  }

  const result = await notifyNewArticles(live);
  return NextResponse.json({ ...result, missing }, { status: result.status === "failed" ? 502 : 200 });
}
