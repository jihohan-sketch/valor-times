import { revalidatePath } from "next/cache";

import { authors } from "@/data/authors";
import { categories } from "@/data/categories";
import type { Article, CategorySlug } from "@/data/types";

const CATEGORY_SLUGS = new Set(categories.map((category) => category.slug));
const AUTHOR_SLUGS = new Set(authors.map((author) => author.slug));

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function parseArticle(body: unknown, fallbackSlug?: string): Article | { error: string } {
  if (!body || typeof body !== "object") return { error: "Invalid story." };

  const data = body as Record<string, unknown>;
  const title = String(data.title ?? "").trim();
  const dek = String(data.dek ?? "").trim();
  const content = String(data.content ?? "").trim();
  const slug = slugify(String(data.slug ?? fallbackSlug ?? title));
  const category = String(data.category ?? "") as CategorySlug;
  const authorSlug = String(data.authorSlug ?? "staff");
  const date = String(data.date ?? "").trim();
  const image = String(data.image ?? "").trim();
  const imageAlt = String(data.imageAlt ?? "").trim();
  const tags = Array.isArray(data.tags)
    ? data.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : String(data.tags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

  if (!title) return { error: "Headline is required." };
  if (!dek) return { error: "Dek is required." };
  if (!content) return { error: "Body copy is required." };
  if (!slug) return { error: "Slug is required." };
  if (!CATEGORY_SLUGS.has(category)) return { error: "Unknown section." };
  if (!AUTHOR_SLUGS.has(authorSlug)) return { error: "Unknown byline." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Date must be YYYY-MM-DD." };

  // Stories filed through the desk are not part of a printed issue unless the
  // editor says which one; an empty issueSlug simply means "web only".
  const issueSlug = String(data.issueSlug ?? "").trim();
  const page = Number(data.page ?? 0) || 0;

  const featured = Boolean(data.featured);
  /* `trendingRank` is the old name for this field, still accepted so anything
     already filed through the API keeps working. */
  const rankRaw = data.editorsRank ?? data.trendingRank;
  const editorsRank =
    rankRaw === "" || rankRaw === null || rankRaw === undefined
      ? undefined
      : Number(rankRaw);

  if (editorsRank !== undefined && (!Number.isFinite(editorsRank) || editorsRank < 1)) {
    return { error: "Editor's rank must be a positive number." };
  }

  return {
    slug,
    title,
    dek,
    category,
    authorSlug,
    date,
    image,
    imageAlt: imageAlt || title,
    tags,
    issueSlug,
    page,
    featured: featured || undefined,
    editorsRank,
    content,
  };
}

export function revalidatePaper() {
  revalidatePath("/", "layout");
  revalidatePath("/archive");
  revalidatePath("/editors-picks");
  revalidatePath("/search");
  revalidatePath("/about");
  revalidatePath("/issues");
  revalidatePath("/issues/[slug]", "page");
  revalidatePath("/article/[slug]", "page");
  revalidatePath("/category/[slug]", "page");
}
