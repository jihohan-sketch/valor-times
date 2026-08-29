import { parseContent } from "@/lib/format";

/** Renders an article body. See `parseContent` for the four supported prefixes. */
export function ArticleBody({ content }: { content: string }) {
  const blocks = parseContent(content);
  // The drop cap belongs to the opening paragraph only.
  const firstParagraph = blocks.findIndex((block) => block.type === "paragraph");

  return (
    <div className="prose-body text-ink">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="headline mt-12 mb-4 text-[1.75rem] md:text-3xl"
              >
                {block.text}
              </h2>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="my-10 border-l-2 border-red pl-6 md:-ml-6"
              >
                <p className="headline text-[1.5rem] leading-tight text-ink md:text-[1.875rem]">
                  {block.text}
                </p>
              </blockquote>
            );

          case "list":
            return (
              <ul key={index} className="my-7 space-y-3">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-4">
                    <span
                      aria-hidden
                      className="mt-[0.7em] h-px w-5 shrink-0 bg-red"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          default: {
            const isFirst = index === firstParagraph;
            return (
              <p
                key={index}
                className={
                  isFirst
                    ? "mb-6 first-letter:mr-2 first-letter:float-left first-letter:font-[family-name:var(--font-display)] first-letter:text-[4.2rem] first-letter:leading-[0.82] first-letter:font-semibold first-letter:text-ink"
                    : "mb-6"
                }
              >
                {block.text}
              </p>
            );
          }
        }
      })}
    </div>
  );
}
