import Image from "next/image";
import Link from "next/link";

import { Byline } from "@/components/ui/Byline";
import { Kicker } from "@/components/ui/Kicker";
import { type Article } from "@/data";
import { isMount, plateAspect } from "@/data/plate";

/**
 * The dominant card: image above, oversized serif headline below.
 * Used for the lead of a section and for the top of the Latest run.
 *
 * The hover is three small things happening at once — the plate zooms inside
 * its frame, the red rule beside the kicker extends, and the headline draws its
 * own underline — which together read as one object responding, rather than as
 * three effects on three elements.
 */
export function FeatureCard({
  article,
  size = "lg",
  priority = false,
}: {
  article: Article;
  size?: "lg" | "md";
  priority?: boolean;
}) {
  const large = size === "lg";
  /* Only the drawn Comics & Bible pages are mounted and shown whole — see
     isMount. A clipping of printed type is cropped to the frame like a
     photograph; contained, it is a whole newspaper page shrunk to card width,
     which is a grey rectangle rather than a picture. */
  const plate = isMount(article);

  return (
    <article className="group">
      <Link href={`/article/${article.slug}`} className="block">
        {article.image && (
          <div
            className={`zoom-frame relative ${
              plate
                ? `bg-paper p-3 md:p-5 ${plateAspect(article)}`
                : large
                  ? "aspect-[16/10]"
                  : "aspect-[3/2]"
            }`}
          >
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              priority={priority}
              sizes={large ? "(max-width: 1024px) 100vw, 62vw" : "(max-width: 768px) 100vw, 45vw"}
              className={plate ? "object-contain" : "object-cover object-center"}
            />
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <span
              className="h-px w-6 bg-red transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-12"
              aria-hidden="true"
            />
            <Kicker category={article.category} href={false} />
          </div>

          <h3
            className={`display mt-4 text-balance ${
              large
                ? "text-[clamp(1.85rem,3.4vw,3rem)]"
                : "text-[length:var(--text-title)]"
            }`}
          >
            <span className="link-draw">{article.title}</span>
          </h3>

          <p
            className={`mt-4 max-w-2xl leading-relaxed text-ink-2 ${
              large ? "text-base md:text-lg" : "text-[0.95rem]"
            }`}
          >
            {article.dek}
          </p>

          <div className="mt-5">
            <Byline article={article} showViews />
          </div>
        </div>
      </Link>
    </article>
  );
}
