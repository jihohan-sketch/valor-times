import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";

import { RowCard } from "@/components/cards/RowCard";
import { categories, searchArticles } from "@/data";

export const metadata: Metadata = pageMetadata({
  title: "Search",
  description: "Search headlines, bylines, and keywords across The Valor Times archive.",
  path: "/search",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? searchArticles(query) : [];

  return (
    <div className="shell py-12 md:py-20">
      <header className="border-b-2 border-ink pb-8">
        <span className="kicker text-red">Search</span>
        <h1 className="display-tight mt-5 text-[clamp(2.25rem,6vw,4.5rem)]">
          {query ? `“${query}”` : "Search the archive"}
        </h1>
        {query && (
          <p className="mt-5 text-lg text-ink-2">
            {results.length === 0
              ? "No stories matched. Try a section name, an author, or a single keyword."
              : `${results.length} ${results.length === 1 ? "story" : "stories"} found.`}
          </p>
        )}
      </header>

      {results.length > 0 ? (
        <div className="mt-10 grid gap-x-14 md:grid-cols-2">
          {results.map((article) => (
            <RowCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="mt-12">
          <p className="kicker text-muted">Or browse by section</p>
          <ul className="mt-6 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <li key={category.slug} className="border-t-2 border-ink py-5">
                <Link href={`/category/${category.slug}`} className="group block">
                  <h2 className="display text-2xl">
                    <span className="link-draw">{category.title}</span>
                  </h2>
                  <p className="mt-2 text-sm text-ink-2">{category.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
