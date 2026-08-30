import { RailCard } from "@/components/cards/RailCard";
import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Article, Category } from "@/data";

/** Related reading, then the rest of the desk. Both scroll horizontally. */
export function RelatedStories({
  related,
  category,
  more,
}: {
  related: Article[];
  category: Category;
  more: Article[];
}) {
  return (
    <>
      {related.length > 0 && (
        <section className="shell band" aria-labelledby="related">
          <Reveal>
            <SectionHead
              id="related"
              kicker="Keep reading"
              title="Related Stories"
              size="md"
            />
          </Reveal>
          <Reveal className="mt-9">
            <Rail count={related.length} label="Related stories">
              {related.map((article) => (
                <RailCard
                  key={article.slug}
                  article={article}
                  ratio="landscape"
                  width="w-[76vw] sm:w-[46vw] lg:w-[28vw] xl:w-[23rem]"
                />
              ))}
            </Rail>
          </Reveal>
        </section>
      )}

      {more.length > 0 && (
        <section className="band bg-shell" aria-labelledby="more-from">
          <div className="shell">
            <Reveal>
              <SectionHead
                id="more-from"
                kicker={category.kicker}
                title={`More from ${category.title}`}
                href={`/category/${category.slug}`}
                linkLabel="All stories"
                size="md"
              />
            </Reveal>
            <Reveal className="mt-9">
              <Rail count={more.length} label={`More from ${category.title}`}>
                {more.map((article) => (
                  <RailCard
                    key={article.slug}
                    article={article}
                    ratio="landscape"
                    showKicker={false}
                    width="w-[76vw] sm:w-[46vw] lg:w-[28vw] xl:w-[23rem]"
                  />
                ))}
              </Rail>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
