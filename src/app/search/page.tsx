import type { Metadata } from "next";
import Link from "next/link";

import { StoryCard } from "@/components/ui/StoryCard";
import { StoryRow } from "@/components/ui/StoryRow";
import { allArticles, categories, searchArticles } from "@/data";

export const metadata: Metadata = {
  title: "Search",
  description: "Search every story Valor Times has published.",
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? searchArticles(query) : [];
  const showArchive = query.length === 0;

  return (
    <>
      <header className="shell pt-12 md:pt-20">
        <div className="border-b-2 border-ink pb-10">
          <p className="kicker text-red">
            {showArchive ? "Archive" : "Search"}
          </p>

          {/* Plain GET form: search works with JavaScript disabled. */}
          <form action="/search" method="get" className="mt-5">
            <label htmlFor="q" className="sr-only">
              Search Valor Times
            </label>
            <div className="flex items-end gap-4 border-b-2 border-ink pb-4">
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Search every story"
                autoComplete="off"
                className="headline w-full bg-transparent text-[clamp(1.75rem,5vw,3.5rem)] outline-none placeholder:text-rule-strong"
              />
              <button
                type="submit"
                className="kicker shrink-0 pb-2 text-red transition-transform duration-500 ease-out-expo hover:translate-x-1"
              >
                Search →
              </button>
            </div>
          </form>

          <p className="kicker mt-5 text-muted">
            {showArchive
              ? `${allArticles.length} stories published`
              : `${results.length} ${results.length === 1 ? "result" : "results"} for “${query}”`}
          </p>
        </div>
      </header>

      {showArchive && (
        <section className="shell mt-12" aria-label="Full archive">
          <div className="divide-y divide-rule border-t border-rule">
            {allArticles.map((article) => (
              <StoryRow key={article.slug} article={article} showDek />
            ))}
          </div>
        </section>
      )}

      {!showArchive && results.length > 0 && (
        <section className="shell mt-12" aria-label="Search results">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((article) => (
              <StoryCard key={article.slug} article={article} showDek />
            ))}
          </div>
        </section>
      )}

      {!showArchive && results.length === 0 && (
        <section className="shell mt-16" aria-label="No results">
          <div className="max-w-2xl">
            <h2 className="headline text-3xl md:text-4xl">
              Nothing matched that.
            </h2>
            <p className="prose-body mt-5 text-ink-soft">
              Try a broader term, or start from a section. If we should be
              covering this and are not, that is worth an email.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="kicker border border-rule px-3.5 py-2 text-ink-soft transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
