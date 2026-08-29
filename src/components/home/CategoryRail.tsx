import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StoryCard } from "@/components/ui/StoryCard";
import type { Article, CategorySlug } from "@/data/types";

interface CategoryRailProps {
  id: string;
  title: string;
  description: string;
  category: CategorySlug;
  articles: Article[];
  ratio?: "3/2" | "4/5" | "16/9";
  tone?: "default" | "inverted";
}

/** A horizontally scrolling shelf for one section of the paper. */
export function CategoryRail({
  id,
  title,
  description,
  category,
  articles,
  ratio = "3/2",
  tone = "default",
}: CategoryRailProps) {
  return (
    <section
      className={tone === "inverted" ? "text-paper" : ""}
      aria-labelledby={id}
    >
      <div className="shell">
        <SectionHeader
          id={id}
          title={title}
          description={description}
          href={`/category/${category}`}
          linkLabel="All stories"
          tone={tone}
        />

        <Reveal className="mt-9">
          <Rail label={title} tone={tone}>
            {articles.map((article) => (
              <li
                key={article.slug}
                className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[25rem]"
              >
                <StoryCard article={article} ratio={ratio} showDek />
              </li>
            ))}
          </Rail>
        </Reveal>
      </div>
    </section>
  );
}
