import { mkdirSync, writeFileSync } from "fs";
import path from "path";

import type { Article } from "@/data/types";

import { renderHtml, renderText, SUBJECT, summarize } from "./email";
import { sendGmail } from "./gmail";

/**
 * Tells the school that new stories are up. Called once per publishing event
 * with every story that went live in it, so a batch is one email.
 *
 * Never throws. A failed send is logged with the reason and the slugs it was
 * for, and publishing carries on — the story is already live by the time this
 * runs, and a broken mailer must not take the desk down with it.
 *
 *   NEWS_EMAIL_FROM        sender; must be the account the Gmail token belongs to
 *   NEWS_EMAIL_RECIPIENTS  comma-separated list. Kept out of the source because
 *                          the repository is public and these are school-wide
 *                          lists — published addresses get spam.
 *   NEWS_EMAIL_DRY_RUN     "1" renders the email to .cache/ and logs it instead
 *                          of sending. Use it for every test.
 */

const DEFAULT_FROM = "timesvalor@gmail.com";

export type NotifyResult =
  | { status: "sent"; messageId: string; recipients: string[]; slugs: string[] }
  | { status: "dry-run"; recipients: string[]; slugs: string[]; preview: string | null }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string; slugs: string[] };

function recipients() {
  return (process.env.NEWS_EMAIL_RECIPIENTS ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

function writePreview(html: string) {
  try {
    const file = path.join(process.cwd(), ".cache", "last-news-email.html");
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, html);
    return file;
  } catch {
    return null; // read-only filesystem; the log line still carries the details
  }
}

export async function notifyNewArticles(articles: Article[]): Promise<NotifyResult> {
  const slugs = [...new Set(articles.map((article) => article.slug))];
  const unique = slugs.map((slug) => articles.find((article) => article.slug === slug)!);
  if (!unique.length) return { status: "skipped", reason: "no new stories" };

  const to = recipients();
  if (!to.length) {
    const reason = "NEWS_EMAIL_RECIPIENTS is not set";
    console.error(`[news-email] not sent for ${slugs.join(", ")}: ${reason}.`);
    return { status: "skipped", reason };
  }

  const stories = unique.map(summarize);
  const email = {
    from: process.env.NEWS_EMAIL_FROM || DEFAULT_FROM,
    to,
    subject: SUBJECT,
    text: renderText(stories),
    html: renderHtml(stories),
  };

  if (process.env.NEWS_EMAIL_DRY_RUN === "1") {
    const preview = writePreview(email.html);
    console.info(
      `[news-email] DRY RUN — would send from ${email.from} to ${to.join(", ")} for ${slugs.join(", ")}` +
        (preview ? ` (preview: ${preview})` : ""),
    );
    console.info(email.text);
    return { status: "dry-run", recipients: to, slugs, preview };
  }

  try {
    const messageId = await sendGmail(email);
    console.info(
      `[news-email] sent ${messageId} from ${email.from} to ${to.join(", ")} for ${slugs.join(", ")}`,
    );
    return { status: "sent", messageId, recipients: to, slugs };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`[news-email] FAILED for ${slugs.join(", ")}: ${reason}`);
    return { status: "failed", reason, slugs };
  }
}
