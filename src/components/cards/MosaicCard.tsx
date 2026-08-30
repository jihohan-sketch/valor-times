import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import { authorBySlug, type Article } from "@/data";
import { aspectOf } from "@/data/image-sizes";
import { isClipping, isPlate, plateAspect } from "@/data/plate";
import { formatDateShort } from "@/lib/format";

/**
 * How far a plate's true shape may sit from its standard mount before the
 * mount stops helping. A quarter either way.
 *
 * The paper cuts plates to two sizes and almost every one of them arrives at
 * that size: the clippings come out of the PDF within a few per cent of 3:2,
 * the drawn back pages within a few per cent of 3:4. Mounting those at the
 * standard is what makes a board of them read as a picture desk's work rather
 * than as a pile of accidents, and the couple of per cent of paper it leaves
 * around the edge reads as the mount's own margin.
 *
 * A handful do not arrive at that size — four portrait clippings, two
 * panoramas, and the landscape Psalm page that runs among the portrait comics —
 * and forcing those into the standard would strand them in a well of empty
 * paper, which is the exact failure GalleryCard was rebuilt to fix. Past this
 * tolerance the mount is cut to the plate instead.
 */
const MOUNT_TOLERANCE = 1.25;

type Mount = { className: string; style?: CSSProperties };

/** The frame this particular piece of artwork gets, and why. */
function mountFor(article: Article): Mount {
  const natural = aspectOf(article.image);

  /* A photograph has no standard size — it is cropped to whatever the layout
     asks for. A board asks for nothing, so it simply keeps its own shape, and
     the variety of those shapes is what the columns are made of. */
  if (!isPlate(article)) return { className: "", style: { aspectRatio: natural } };

  const standard = isClipping(article) ? 3 / 2 : 3 / 4;
  const fits =
    natural / standard <= MOUNT_TOLERANCE && standard / natural <= MOUNT_TOLERANCE;

  return fits
    ? { className: plateAspect(article) }
    : { className: "", style: { aspectRatio: natural } };
}

/**
 * One piece pinned to the board.
 *
 * The card carries no frame of its own: its height is whatever its artwork is,
 * which is the only reason the mosaic around it has anything to arrange. Plates
 * are mounted on paper and contained, so no clipping loses a word and no strip
 * loses a panel; photographs fill their frame, which at their own proportions
 * means they are never actually cut.
 *
 * It owns its own Reveal, and that is deliberate rather than convenient. The
 * reveal has to be on the same element as `break-inside: avoid` — a mask on a
 * wrapper and a break rule on the child can disagree about where the card ends
 * — and the card is the only thing that knows it is leading with artwork and
 * should therefore un-mask rather than slide. A board of fourteen cards sliding
 * up out of staggered columns reads as the layout settling, which is the one
 * thing a masonry layout must never look like; the same fourteen clearing their
 * masks read as a board being pinned up. Both stand down under
 * prefers-reduced-motion through the rules in globals.css.
 */
export function MosaicCard({
  article,
  delay = 0,
}: {
  article: Article;
  /** Stagger for cards that enter the viewport together. */
  delay?: number;
}) {
  const author = authorBySlug[article.authorSlug];
  const plate = isPlate(article);
  const mount = article.image ? mountFor(article) : null;

  return (
    <Reveal
      as="li"
      /* Artwork un-masks; a story with no artwork has nothing to un-mask and
         takes the ordinary reveal. */
      plate={Boolean(article.image)}
      delay={delay}
      className="group mb-9 break-inside-avoid md:mb-12"
    >
      <Link href={`/article/${article.slug}`} className="block">
        <figure>
          {mount && (
            <div
              className={`card-lift relative ${mount.className} ${
                plate
                  ? "bg-paper p-2.5 ring-1 ring-rule-2 transition-colors duration-300 group-hover:ring-ink md:p-3.5"
                  : "zoom-frame"
              }`}
              style={mount.style}
            >
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                sizes="(max-width: 768px) 45vw, (max-width: 1280px) 30vw, 22vw"
                className={
                  plate
                    ? "object-contain"
                    : "object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                }
              />
            </div>
          )}

          {/* Which desk it came from and which page it ran on. A board mixes
              two sections, so the caption has to say where a piece is from —
              and a picture desk marks every plate with its page. */}
          <figcaption className="mt-4">
            <div className="flex items-baseline justify-between gap-3">
              <Kicker category={article.category} href={false} />
              <span className="meta shrink-0 tabular-nums">p. {article.page}</span>
            </div>
            <h3 className="headline mt-2.5 text-balance text-[0.95rem] leading-snug md:text-[1.05rem] xl:text-[length:var(--text-title-sm)]">
              <span className="link-draw">{article.title}</span>
            </h3>
            <p className="meta mt-2.5">
              <span className="text-ink-2">{author?.name}</span>
              <span className="mx-2 opacity-40">/</span>
              {formatDateShort(article.date)}
            </p>
          </figcaption>
        </figure>
      </Link>
    </Reveal>
  );
}
