import { after, NextResponse } from "next/server";

import { getAllArticles } from "@/data";
import type { Article } from "@/data/types";
import { parseArticle, revalidatePaper } from "@/lib/cms/article";
import { isAdminRequest } from "@/lib/cms/auth";
import { upsertArticle } from "@/lib/cms/store";
import { notifyNewArticles } from "@/lib/notify";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ articles: getAllArticles() });
}

/**
 * Files one story, or several at once as `{ articles: [...] }`. A batch is
 * all-or-nothing: every story is checked before any is published, so a bad
 * one never leaves half a batch live. Only this route — a story's first
 * appearance — sends the "new on Valor Times" email; edits go through PUT and
 * never do.
 */
export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const batch = Boolean(body && typeof body === "object" && Array.isArray((body as { articles?: unknown }).articles));
  const entries = batch ? (body as { articles: unknown[] }).articles : [body];
  if (!entries.length) {
    return NextResponse.json({ error: "No stories to publish." }, { status: 400 });
  }

  const taken = new Set(getAllArticles().map((article) => article.slug));
  const parsed: Article[] = [];
  for (const [index, entry] of entries.entries()) {
    const result = parseArticle(entry);
    const label = batch ? `Story ${index + 1}: ` : "";
    if ("error" in result) {
      return NextResponse.json({ error: `${label}${result.error}` }, { status: 400 });
    }
    if (taken.has(result.slug)) {
      return NextResponse.json({ error: `${label}That slug is already in use.` }, { status: 409 });
    }
    taken.add(result.slug);
    parsed.push(result);
  }

  for (const article of parsed) upsertArticle(article);
  revalidatePaper();

  // After the response: the stories are live and the editor is not kept
  // waiting on Gmail. notifyNewArticles logs its own failures and never throws.
  after(() => notifyNewArticles(parsed));

  return NextResponse.json(batch ? { articles: parsed } : { article: parsed[0] }, { status: 201 });
}
