import { QuoteCard } from "@/components/cards/QuoteCard";
import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Article, Category } from "@/data";

/**
 * Recommendations & Opinions: no artwork at all. The argument is the object,
 * so the cards are pure type and turn red under the cursor.
 */
export function QuotesSection({
  category,
  articles,
}: {
  category: Category;
  articles: Article[];
}) {
  if (articles.length === 0) return null;

  return (
    <section className="shell py-16 md:py-24" aria-labelledby={`sec-${category.slug}`}>
      <Reveal>
        <SectionHead
          kicker={category.kicker}
          title={category.title}
          description={category.description}
          href={`/category/${category.slug}`}
        />
      </Reveal>

      <Reveal className="mt-10 md:mt-14">
        <Rail count={articles.length} label={`${category.title}`}>
          {articles.map((article, i) => (
            <QuoteCard key={article.slug} article={article} index={i + 1} />
          ))}
        </Rail>
      </Reveal>
    </section>
  );
}
