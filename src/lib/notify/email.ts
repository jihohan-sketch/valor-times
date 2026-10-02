import { authorBySlug } from "@/data/authors";
import type { Article } from "@/data/types";
import { site } from "@/lib/site";

/**
 * The "we just put something up" email. One message per publishing event,
 * however many stories went up in it. Everything printed is pulled from the
 * stories themselves: headline, byline, the dek as the excerpt, and the
 * story's own production URL — no tracking parameters.
 */

export const SUBJECT = "Hey! Valor Times just got updated 👀";

const EXCERPT_LIMIT = 220;

export interface StorySummary {
  title: string;
  author: string;
  excerpt: string;
  url: string;
}

function excerptOf(article: Article) {
  const text = article.dek.replace(/\s+/g, " ").trim();
  if (text.length <= EXCERPT_LIMIT) return text;
  return `${text.slice(0, EXCERPT_LIMIT).replace(/\s+\S*$/, "")}…`;
}

export function summarize(article: Article): StorySummary {
  return {
    title: article.title,
    author: authorBySlug[article.authorSlug]?.name ?? "The Valor Times Staff",
    excerpt: excerptOf(article),
    url: `${site.url}/article/${encodeURIComponent(article.slug)}`,
  };
}

const INTRO = [
  "Hey everyone!",
  "Just a friendly reminder that the Valor Times website has been updated! 👀",
  "New stories, school news, and things happening around campus are waiting for you.",
  "So… before you go back to scrolling, take a minute to check out what’s new. You might even find something interesting. 👀",
];

export function renderText(stories: StorySummary[]) {
  const blocks = stories.map((story) =>
    [story.title.toUpperCase(), `By ${story.author}`, "", story.excerpt, "", `👉 Check out Valor Times → ${story.url}`].join("\n"),
  );
  return [
    ...INTRO,
    "",
    "📰 NEW ON VALOR TIMES",
    "",
    blocks.join("\n\n---\n\n"),
    "",
    "See you on the website,\nThe Valor Times Team",
    "",
  ].join("\n\n").replace(/\n{3,}/g, "\n\n");
}

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* The site's own palette (globals.css) — paper, ink, rule and the masthead red. */
const INK = "#0d0d10";
const INK_2 = "#3d3d45";
const MUTED = "#76767f";
const RULE = "#e4e1dc";
const RED = "#d81e26";
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function storyBlock(story: StorySummary, first: boolean) {
  const url = escape(story.url);
  return `
<tr><td style="padding:${first ? "8px" : "28px"} 0 0;${first ? "" : `border-top:1px solid ${RULE};`}">
  <h2 style="margin:${first ? "0" : "20px"} 0 6px;font-family:${SERIF};font-size:26px;line-height:1.2;font-weight:normal;color:${INK};">
    <a href="${url}" style="color:${INK};text-decoration:none;">${escape(story.title)}</a>
  </h2>
  <p style="margin:0 0 12px;font-family:${SANS};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">By ${escape(story.author)}</p>
  <p style="margin:0 0 20px;font-family:${SANS};font-size:16px;line-height:1.55;color:${INK_2};">${escape(story.excerpt)}</p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="border-radius:999px;background:${RED};">
      <a href="${url}" style="display:inline-block;padding:12px 22px;font-family:${SANS};font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">Check out Valor Times &rarr;</a>
    </td>
  </tr></table>
</td></tr>`;
}

export function renderHtml(stories: StorySummary[]) {
  const paragraph = (text: string) =>
    `<p style="margin:0 0 14px;font-family:${SANS};font-size:16px;line-height:1.6;color:${INK_2};">${escape(text)}</p>`;
  const preheader = stories.map((story) => story.title).join(" · ");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escape(SUBJECT)}</title>
<style>
  @media (max-width: 600px) {
    .vt-card { padding: 28px 20px !important; }
    .vt-shell { padding: 12px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f1ea;">
<tr><td class="vt-shell" align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
    <tr><td class="vt-card" style="background:#ffffff;border-top:4px solid ${RED};padding:36px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="padding-bottom:24px;border-bottom:1px solid ${RULE};">
          <a href="${site.url}" style="font-family:${SERIF};font-size:30px;color:${INK};text-decoration:none;letter-spacing:-0.5px;">Valor Times</a>
          <div style="margin-top:4px;font-family:${SANS};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">${escape(site.tagline)}</div>
        </td></tr>
        <tr><td style="padding-top:26px;">
          ${paragraph(INTRO[0])}
          ${INTRO.slice(1).map(paragraph).join("\n          ")}
        </td></tr>
        <tr><td style="padding-top:18px;">
          <p style="margin:0;font-family:${SANS};font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${RED};">📰 New on Valor Times</p>
        </td></tr>
        ${stories.map((story, index) => storyBlock(story, index === 0)).join("")}
        <tr><td style="padding-top:34px;">
          <p style="margin:0;font-family:${SANS};font-size:16px;line-height:1.6;color:${INK_2};">See you on the website,<br><strong style="color:${INK};">The Valor Times Team</strong></p>
        </td></tr>
      </table>
    </td></tr>
    <tr><td align="center" style="padding:18px 8px 0;font-family:${SANS};font-size:12px;line-height:1.5;color:${MUTED};">
      <a href="${site.url}" style="color:${MUTED};">${escape(site.domain)}</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
