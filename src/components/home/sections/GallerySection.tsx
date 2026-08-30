import { GalleryCard } from "@/components/cards/GalleryCard";
import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { isStrip } from "@/data/plate";
import type { Article, Category } from "@/data";

/**
 * Comics & Bible. The artwork is the story here, so the section drops onto a
 * dark ground, the plates get the largest frames on the site, and the type
 * underneath behaves like a gallery caption rather than a headline.
 *
 * The rail is sized by height, not by width: `--plate-h` sets how tall every
 * plate stands and each card works out its own width from the proportions of
 * the file it is showing. That is what makes the row read as a shelf of real
 * objects — a tall strip beside a wide Psalm page — with nothing cropped and
 * nothing floating in dead paper. See GalleryCard.
 */
export function GallerySection({
  category,
  articles,
}: {
  category: Category;
  articles: Article[];
}) {
  if (articles.length === 0) return null;

  const strips = articles.filter(isStrip).length;
  const readings = articles.length - strips;

  return (
    <section className="band bg-ink text-paper" aria-labelledby={`sec-${category.slug}`}>
      <div className="shell">
        <Reveal>
          <SectionHead
            id={`sec-${category.slug}`}
            kicker={category.kicker}
            title={category.title}
            description={category.description}
            href={`/category/${category.slug}`}
            linkLabel="The back page"
            tone="paper"
            note={
              <>
                <span className="text-red">{String(strips).padStart(2, "0")}</span> strips
                <span className="mx-2 opacity-40">/</span>
                <span className="text-red">{String(readings).padStart(2, "0")}</span> readings
              </>
            }
          />
        </Reveal>

        <Reveal className="mt-10 md:mt-14">
          <Rail
            count={articles.length}
            label="Comics and Bible readings"
            tone="paper"
            align="start"
            /* One height for the whole shelf. Generous on a desktop, still tall
               enough on a phone that the lettering inside a strip is legible. */
            style={
              {
                "--plate-h": "clamp(19rem, 52vh, 34rem)",
                "--plate-pad": "1.5rem",
                "--plate-max-w": "min(84vw, 44rem)",
              } as React.CSSProperties
            }
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
