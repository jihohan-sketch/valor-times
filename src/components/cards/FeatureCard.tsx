import Image from "next/image";
import Link from "next/link";

import { Byline } from "@/components/ui/Byline";
import { Kicker } from "@/components/ui/Kicker";
import { isPlate, type Article } from "@/data";

/**
 * The dominant card: image above, oversized serif headline below.
 * Used for the lead of a section and for the top of the Latest run.
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
  /* Comics run portrait and must not be cropped — see isPlate. */
  const plate = isPlate(article);

  return (
    <article className="group">
      <Link href={`/article/${article.slug}`} className="block">
        {article.image && (
          <div
            className={`zoom-frame relative ${
              plate
                ? `bg-paper p-3 md:p-5 ${large ? "aspect-[4/5]" : "aspect-[3/4]"}`
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
              className={plate ? "object-contain" : "object-cover"}
            />
          </div>
        )}

        <div className="mt-5 md:mt-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-red" aria-hidden="true" />
            <Kicker category={article.category} href={false} />
          </div>

          <h3
            className={`display mt-3 text-balance ${
              large ? "text-[clamp(1.85rem,3.4vw,3rem)]" : "text-[clamp(1.5rem,2.4vw,2.15rem)]"
            }`}
          >
            <span className="link-draw">{article.title}</span>
          </h3>

          <p
            className={`mt-3 max-w-2xl text-ink-2 ${large ? "text-base md:text-lg" : "text-[0.95rem]"}`}
          >
            {article.dek}
          </p>

          <div className="mt-4">
            <Byline article={article} showViews />
          </div>
        </div>
      </Link>
    </article>
  );
}
