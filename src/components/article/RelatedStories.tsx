import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StoryCard } from "@/components/ui/StoryCard";
import type { Article } from "@/data/types";

export function RelatedStories({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="shell mt-20 md:mt-28" aria-labelledby="related">
      <SectionHeader
        id="related"
        title="Related Stories"
        description="More from the desk, and from the same argument."
      />
      <div className="mt-9 grid gap-10 md:grid-cols-3">
        {articles.map((article, index) => (
          <Reveal key={article.slug} delay={index * 90}>
            <StoryCard article={article} showDek />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
