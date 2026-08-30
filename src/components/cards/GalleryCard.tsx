import Image from "next/image";
import Link from "next/link";

import { aspectOf } from "@/data/image-sizes";
import { authorBySlug, type Article } from "@/data";
import { isStrip } from "@/data/plate";
import { formatDateShort } from "@/lib/format";

/** Mount width implied by the shared height, and vice versa. */
const width = (ratio: number) =>
  `calc((var(--plate-h) - var(--plate-pad)) * ${ratio} + var(--plate-pad))`;

const height = (ratio: number) =>
  `calc((var(--plate-max-w) - var(--plate-pad)) / ${ratio} + var(--plate-pad))`;

/**
 * A drawn plate, shown whole.
 *
 * These are the only images on the site that are *documents*: a comic strip and
 * a Bible page are read, not looked at, and a crop takes a panel or half a
 * sentence with it. The old frame forced every one of them into a 3:4 box and
 * contained the image inside it, which fixed the cropping and introduced two
 * new problems — the landscape Psalm plate floated in a tall well of empty
 * paper, and the tallest strip sat letterboxed with slivers down both sides.
 *
 * So the frame takes its ratio from the file itself (`aspectOf`) and the card
 * is sized by *height* instead of width: every plate on the rail stands the
 * same height, and a wide one is simply a wider card. Nothing is cropped,
 * nothing is stretched, nothing is padded out with dead space, and the rail
 * reads as a shelf of objects of different shapes — which is what it is.
 *
 * Two custom properties, set by the section, do all of it: `--plate-h` is the
 * shared height and `--plate-max-w` is the widest a mount may ever be. When a
 * plate's natural width would exceed that cap — which on a desktop it never
 * does, and on a phone only the one landscape Psalm page does — the height
 * comes down to match instead of the image being cropped or squeezed. The
 * ratio is therefore exact in both branches, and no plate can ever be wider
 * than the screen it is being read on.
 */
export function GalleryCard({
  article,
  tone = "ink",
}: {
  article: Article;
  tone?: "ink" | "paper";
}) {
  const onPaper = tone === "paper";
  const author = authorBySlug[article.authorSlug];
  const strip = isStrip(article);
  const ratio = aspectOf(article.image);

  return (
    <figure className="group flex flex-col">
      <Link href={`/article/${article.slug}`} className="flex flex-col">
        {/* The mount. Width follows the plate's own proportions off a shared
            height, so the image fills it exactly — no crop, no letterbox. */}
        <div
          className={`card-lift relative shrink-0 bg-paper p-3 ring-1 ${
            onPaper ? "ring-paper/20" : "ring-ink/10"
          }`}
          style={{
            /* The mount is the plate plus its own padding, so both dimensions
               subtract the padding before applying the ratio and add it back —
               which is what keeps the image filling the frame exactly. */
            width: `min(${width(ratio)}, var(--plate-max-w))`,
            height: `min(var(--plate-h), ${height(ratio)})`,
          }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              sizes="(max-width: 640px) 70vw, 420px"
              className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
            />
          </div>
        </div>

        {/* The caption is measured against the mount above it, so a wide plate
            gets a wide caption and a narrow one does not run to three lines. */}
        <figcaption
          className="mt-5 flex items-start justify-between gap-6"
          style={{
            width: `min(${width(ratio)}, var(--plate-max-w))`,
            minWidth: "14rem",
            maxWidth: "26rem",
          }}
        >
          <div className="min-w-0">
            <h3
              className={`display text-[1.3rem] leading-tight text-balance md:text-[1.5rem] ${
                onPaper ? "text-paper" : ""
              }`}
            >
              <span className="link-draw">{article.title}</span>
            </h3>
            <p className={`meta mt-2 ${onPaper ? "text-paper/55" : ""}`}>
              <span className={onPaper ? "text-paper/90" : "text-ink-2"}>
                {author?.name}
              </span>
              <span className="mx-2 opacity-40">/</span>
              {formatDateShort(article.date)}
            </p>
          </div>
          <span className="kicker mt-1 shrink-0 text-red">
            {strip ? "Strip" : "Reading"}
          </span>
        </figcaption>
      </Link>
    </figure>
  );
}
