import type { Metadata } from "next";
import Link from "next/link";

import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import { allArticles, authorBySlug } from "@/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Archive",
  description: "Every story Valor Times has published, newest first.",
};

/** Groups the run by month so the archive reads as a set of issues. */
function byMonth() {
  const groups = new Map<string, typeof allArticles>();
  for (const article of allArticles) {
    const key = article.date.slice(0, 7);
    const list = groups.get(key) ?? [];
    list.push(article);
    groups.set(key, list);
  }
  return [...groups.entries()];
}

const MONTH = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function ArchivePage() {
  const groups = byMonth();

  return (
    <div className="shell py-12 md:py-20">
      <header className="border-b-2 border-ink pb-8">
        <span className="kicker text-red">Everything we have printed</span>
        <h1 className="display-tight mt-5 text-[clamp(2.75rem,8vw,6rem)]">Archive</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
          {allArticles.length} stories across {groups.length} issues, newest first.
        </p>
      </header>

      {groups.map(([month, articles]) => (
        <section key={month} className="mt-14">
          <h2 className="kicker-lg sticky top-20 z-10 bg-paper/95 py-3 backdrop-blur">
            {MONTH.format(new Date(`${month}-01T00:00:00Z`))}
            <span className="ml-4 text-muted tabular-nums">
              {String(articles.length).padStart(2, "0")}
            </span>
          </h2>

          <ul className="mt-2">
            {articles.map((article) => (
              <Reveal key={article.slug} as="li">
                <Link
                  href={`/article/${article.slug}`}
                  className="group grid gap-x-8 gap-y-2 border-t border-rule py-5 transition-colors hover:border-red md:grid-cols-[8rem_1fr_9rem] md:items-baseline"
                >
                  <span className="meta tabular-nums">{formatDate(article.date)}</span>
                  <div>
                    <h3 className="headline text-[1.0625rem] text-balance md:text-xl">
                      <span className="link-draw">{article.title}</span>
                    </h3>
                    <p className="meta mt-1.5 md:hidden">
                      {authorBySlug[article.authorSlug]?.name}
                    </p>
                  </div>
                  <div className="hidden text-right md:block">
                    <Kicker category={article.category} href={false} />
                    <p className="meta mt-1.5">{authorBySlug[article.authorSlug]?.name}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
