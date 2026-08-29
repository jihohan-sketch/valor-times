import { parseContent } from "@/lib/format";

/**
 * Renders a parsed article body. Bold runs marked with **double asterisks**
 * are the only inline markup the newsroom uses.
 */
function inline(text: string, keyPrefix: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

export function ArticleBody({ content }: { content: string }) {
  const blocks = parseContent(content);

  return (
    <div className="prose-vt">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="display mt-12 mb-5 text-[clamp(1.5rem,2.6vw,2.1rem)] text-ink first:mt-0"
              >
                {block.text}
              </h2>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="my-10 border-l-2 border-red py-1 pl-6 md:my-12 md:pl-8"
              >
                <p className="display text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.2] text-ink">
                  {block.text}
                </p>
              </blockquote>
            );

          case "list":
            return (
              <ul key={i} className="my-8 border-t border-rule">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-4 border-b border-rule py-3 text-[0.975rem] md:text-base"
                  >
                    <span
                      className="ordinal mt-1 shrink-0 text-xs text-red"
                      aria-hidden="true"
                    >
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span>{inline(item, `l${i}-${j}`)}</span>
                  </li>
                ))}
              </ul>
            );

          default:
            return <p key={i}>{inline(block.text, `p${i}`)}</p>;
        }
      })}
    </div>
  );
}
