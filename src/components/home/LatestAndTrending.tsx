import { NumberedStory } from "@/components/ui/NumberedStory";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StoryCard } from "@/components/ui/StoryCard";
import { StoryRow } from "@/components/ui/StoryRow";
import type { Article } from "@/data/types";

interface LatestAndTrendingProps {
  latest: Article[];
  trending: Article[];
}

/** Two columns: the running feed on the left, the ranked list on the right. */
export function LatestAndTrending({ latest, trending }: LatestAndTrendingProps) {
  const [featured, ...rest] = latest;

  return (
    <section className="shell mt-20 md:mt-24" aria-labelledby="latest">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-8">
          <SectionHeader
            id="latest"
            title="Latest Stories"
            description="Everything the newsroom has filed, newest first."
            href="/search"
            linkLabel="Browse the archive"
          />

          <div className="mt-9 grid gap-10 sm:grid-cols-2">
            {featured && (
              <Reveal className="sm:col-span-2">
                <StoryCard
                  article={featured}
                  size="lg"
                  showDek
                  ratio="16/9"
                />
              </Reveal>
            )}
            {rest.slice(0, 4).map((article, index) => (
              <Reveal key={article.slug} delay={index * 80}>
                <StoryCard article={article} showDek />
              </Reveal>
            ))}
          </div>

          <div className="mt-6 divide-y divide-rule border-t border-rule">
            {rest.slice(4).map((article) => (
              <StoryRow key={article.slug} article={article} />
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4" aria-labelledby="trending">
          <div className="lg:sticky lg:top-24">
            <SectionHeader id="trending" title="Trending" />
            <div className="mt-7">
              {trending.map((article, index) => (
                <Reveal key={article.slug} delay={index * 60}>
                  <NumberedStory article={article} index={index} />
                </Reveal>
              ))}
            </div>

            <div className="relative mt-10 grain overflow-hidden border border-rule bg-newsprint p-7">
              <p className="kicker text-red">From the editors</p>
              <p className="headline mt-3 text-2xl">
                Every story here was reported, written and edited by students.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                We publish corrections in full, we sign our opinions, and we
                will print a reply to anything on this page.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
