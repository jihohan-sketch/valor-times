import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StoryCard } from "@/components/ui/StoryCard";
import type { Article } from "@/data/types";

/** Cuisine sits on newsprint stock: one tall plate, three smaller ones. */
export function CuisineSection({ articles }: { articles: Article[] }) {
  const [lead, ...rest] = articles;
  if (!lead) return null;

  return (
    <section
      className="relative mt-24 grain overflow-hidden border-y border-rule bg-newsprint py-16 md:py-24"
      aria-labelledby="cuisine"
    >
      <div className="shell relative">
        <SectionHeader
          id="cuisine"
          title="Cuisine"
          description="Lunch lines, family recipes and the serious business of eating well between classes."
          href="/category/cuisine"
          linkLabel="All food writing"
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <StoryCard article={lead} size="lg" ratio="4/5" showDek />
          </Reveal>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:content-start">
            {rest.slice(0, 3).map((article, index) => (
              <Reveal
                key={article.slug}
                delay={index * 90}
                className={index === 2 ? "sm:col-span-2" : ""}
              >
                <StoryCard
                  article={article}
                  size={index === 2 ? "md" : "sm"}
                  ratio={index === 2 ? "16/9" : "3/2"}
                  showDek={index === 2}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
