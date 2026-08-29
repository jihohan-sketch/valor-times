import { NextResponse } from "next/server";

import { getArticle } from "@/data";
import { parseArticle, revalidatePaper } from "@/lib/cms/article";
import { isAdminRequest } from "@/lib/cms/auth";
import { deleteArticle, upsertArticle } from "@/lib/cms/store";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const existing = getArticle(slug);
  if (!existing) {
    return NextResponse.json({ error: "Story not found." }, { status: 404 });
  }

  const parsed = parseArticle(await request.json().catch(() => null), slug);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const article = { ...parsed, slug };
  upsertArticle(article);
  revalidatePaper();
  return NextResponse.json({ article });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  if (!getArticle(slug)) {
    return NextResponse.json({ error: "Story not found." }, { status: 404 });
  }

  deleteArticle(slug);
  revalidatePaper();
  return NextResponse.json({ ok: true });
}
