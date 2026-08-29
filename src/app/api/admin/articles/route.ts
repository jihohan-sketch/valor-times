import { NextResponse } from "next/server";

import { getAllArticles } from "@/data";
import { parseArticle, revalidatePaper } from "@/lib/cms/article";
import { isAdminRequest } from "@/lib/cms/auth";
import { upsertArticle } from "@/lib/cms/store";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ articles: getAllArticles() });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = parseArticle(await request.json().catch(() => null));
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (getAllArticles().some((article) => article.slug === parsed.slug)) {
    return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
  }

  upsertArticle(parsed);
  revalidatePaper();
  return NextResponse.json({ article: parsed }, { status: 201 });
}
