import Link from "next/link";

import { StoryCard } from "@/components/ui/StoryCard";
import { categories, getLatest } from "@/data";

export default function NotFound() {
  return (
    <>
      <header className="shell pt-16 md:pt-24">
        <div className="border-b-2 border-ink pb-10">
          <p className="kicker text-red">Error 404</p>
          <h1 className="headline mt-4 max-w-3xl text-[length:var(--text-mega)]">
            This page went to print without us.
          </h1>
          <p className="prose-body mt-6 max-w-xl text-ink-soft">
            The story you were looking for has either moved or never existed.
            Here is what we are running instead.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link
              href="/"
              className="kicker border border-ink bg-ink px-4 py-2.5 text-paper transition-opacity hover:opacity-80"
            >
              Front page
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="kicker border border-rule px-4 py-2.5 text-ink-soft transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <section className="shell mt-12" aria-label="Latest stories">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {getLatest(3).map((article) => (
            <StoryCard key={article.slug} article={article} showDek />
          ))}
        </div>
      </section>
    </>
  );
}
