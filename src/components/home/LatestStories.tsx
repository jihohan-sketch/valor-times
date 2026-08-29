import { BriefCard } from "@/components/cards/BriefCard";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { RowCard } from "@/components/cards/RowCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import type { Article } from "@/data";

/**
 * Deliberately asymmetric: one image-led lead, a run of horizontal rows
 * beside it, and a column of text-only briefs. No repeating card grid.
 */
export function LatestStories({
  lead,
  rows,
  briefs,
}: {
  lead: Article;
  rows: Article[];
  briefs: Article[];
}) {
  return (
    <section className="shell pb-16 md:pb-24" aria-labelledby="latest">
      <Reveal>
        <SectionHead
          kicker="Fresh off the desk"
          title="Latest Stories"
          href="/archive"
          linkLabel="Full archive"
        />
      </Reveal>

      <div className="mt-10 grid gap-x-10 gap-y-12 md:mt-14 lg:grid-cols-12 lg:gap-x-14">
        {/* Lead */}
        <Reveal className="lg:col-span-6">
          <FeatureCard article={lead} size="lg" />
        </Reveal>

        {/* Horizontal rows */}
        <div className="lg:col-span-6 lg:border-l lg:border-rule lg:pl-14">
          {rows.map((article, i) => (
            <Reveal key={article.slug} delay={i * 60}>
              <RowCard article={article} index={i + 2} />
            </Reveal>
          ))}
        </div>

        {/* Briefs — text only, no artwork, tighter rhythm */}
        <Reveal className="lg:col-span-12">
          <div className="border-t-2 border-ink pt-6">
            <div className="flex items-baseline justify-between">
              <h3 className="kicker-lg">In Brief</h3>
              <span className="kicker text-muted tabular-nums">
                {String(briefs.length).padStart(2, "0")} stories
              </span>
            </div>
            <div className="mt-5 grid gap-x-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-12">
              {briefs.map((article) => (
                <BriefCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
