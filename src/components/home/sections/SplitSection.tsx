import { FeatureCard } from "@/components/cards/FeatureCard";
import { RowCard } from "@/components/cards/RowCard";
import { Reveal } from "@/components/ui/Reveal";
import { Scene } from "@/components/ui/Scene";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Article, Category } from "@/data";

/** School News: one dominant plate, a numbered stack of reporting beside it. */
export function SplitSection({
  category,
  articles,
}: {
  category: Category;
  articles: Article[];
}) {
  const [lead, ...rest] = articles;
  if (!lead) return null;

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

      <div className="mt-10 grid gap-x-14 gap-y-10 md:mt-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Scene>
            <FeatureCard article={lead} size="lg" />
          </Scene>
        </Reveal>

        <div className="lg:col-span-5">
          {rest.slice(0, 4).map((article, i) => (
            <Reveal key={article.slug} delay={i * 55}>
              <RowCard article={article} index={i + 2} showDek={false} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
