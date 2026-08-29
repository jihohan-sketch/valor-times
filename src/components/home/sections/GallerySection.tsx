import { GalleryCard } from "@/components/cards/GalleryCard";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import type { Article, Category } from "@/data";

/**
 * Comics & Bible. The artwork is the story here, so the section drops onto a
 * dark ground, the plates get the largest cards on the site, and the type
 * underneath behaves like a gallery caption rather than a headline.
 */
export function GallerySection({
  category,
  articles,
}: {
  category: Category;
  articles: Article[];
}) {
  if (articles.length === 0) return null;

  const strips = articles.filter((a) => a.slug.startsWith("comic-")).length;
  const readings = articles.length - strips;

  return (
    <section
      className="bg-ink py-16 text-paper md:py-24"
      aria-labelledby={`sec-${category.slug}`}
    >
      <div className="shell">
        <Reveal>
          <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t-2 border-paper pt-5 md:pt-6">
            <div className="max-w-2xl">
              <span className="kicker text-paper/55">{category.kicker}</span>
              <h2
                id={`sec-${category.slug}`}
                className="display mt-3 text-[clamp(2.1rem,4.8vw,3.8rem)]"
              >
                {category.title}
              </h2>
              <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-paper/70 md:text-base">
                {category.description}
              </p>
            </div>

            <div className="flex items-end gap-8">
              <p className="kicker text-paper/45 tabular-nums">
                <span className="text-red">{String(strips).padStart(2, "0")}</span> strips
                <span className="mx-2 opacity-40">/</span>
                <span className="text-red">{String(readings).padStart(2, "0")}</span> readings
              </p>
              <ArrowLink href={`/category/${category.slug}`} tone="paper" size="sm" className="mb-1">
                The back page
              </ArrowLink>
            </div>
          </header>
        </Reveal>

        <Reveal className="mt-10 md:mt-14">
          <Rail
            count={articles.length}
            label="Comics and Bible readings"
            tone="paper"
          >
            {articles.map((article) => (
              <GalleryCard key={article.slug} article={article} tone="paper" />
            ))}
          </Rail>
        </Reveal>
      </div>
    </section>
  );
}
