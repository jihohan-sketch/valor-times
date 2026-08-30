import { RailCard } from "@/components/cards/RailCard";
import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Article, Category } from "@/data";

/** Culture & Lifestyle: portrait plates on a rail that runs off the page. */
export function RailSection({
  category,
  articles,
}: {
  category: Category;
  articles: Article[];
}) {
  if (articles.length === 0) return null;

  return (
    <section className="shell band" aria-labelledby={`sec-${category.slug}`}>
      <Reveal>
        <SectionHead
          id={`sec-${category.slug}`}
          kicker={category.kicker}
          title={category.title}
          description={category.description}
          href={`/category/${category.slug}`}
        />
      </Reveal>

      <Reveal className="mt-10 md:mt-14">
        <Rail count={articles.length} label={`${category.title} stories`}>
          {articles.map((article) => (
            <RailCard key={article.slug} article={article} showKicker={false} />
          ))}
        </Rail>
      </Reveal>
    </section>
  );
}
