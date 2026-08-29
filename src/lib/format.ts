/** Date, reading-time and body-parsing helpers shared across the site. */

const LONG = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const SHORT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
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
