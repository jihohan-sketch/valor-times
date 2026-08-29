/** Date, reading-time and body-parsing helpers shared across the site. */

/**
 * The printed paper carries no publication date — only a volume and number —
 * so every story is dated to the month its issue belongs to and displayed at
 * month precision. Printing a day the paper never gave would be a fabrication.
 */
const LONG = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const SHORT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return LONG.format(new Date(`${iso}T00:00:00Z`));
}

export function formatDateShort(iso: string): string {
  return SHORT.format(new Date(`${iso}T00:00:00Z`));
}

export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export type Block =
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

/**
 * Turns an article body into renderable blocks.
 * "## " heading · "> " pull quote · "- " or "1. " list item · anything else a paragraph.
 */
export function parseContent(content: string): Block[] {
  const blocks: Block[] = [];
  let list: string[] | null = null;

  const flush = () => {
    if (list && list.length > 0) blocks.push({ type: "list", items: list });
    list = null;
  };

  for (const raw of content.split("\n")) {
    const line = raw.trim();

    if (line === "") {
      flush();
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "heading", text: line.slice(3) });
      continue;
    }
    if (line.startsWith("> ")) {
      flush();
      blocks.push({ type: "quote", text: line.slice(2) });
      continue;
    }
    const ordered = line.match(/^(\d+)\.\s+(.*)$/);
    if (line.startsWith("- ") || ordered) {
      list ??= [];
      list.push(ordered ? ordered[2] : line.slice(2));
      continue;
    }
    flush();
    blocks.push({ type: "paragraph", text: line });
  }

  flush();
  return blocks;
}
