"use client";

import { useState } from "react";

/**
 * The way a pitch actually gets sent.
 *
 * ── Why this is not just a `mailto:`
 * It was, and for most of the people this page is written for it did nothing
 * at all. A `mailto:` is a request to the operating system to hand the click
 * to a registered mail application; when there is no such application — a
 * school Chromebook, a shared library machine, anyone who reads mail at
 * mail.google.com and has never opened Mail or Outlook — the browser has
 * nowhere to send it and the click is a silent no-op. No error, no new tab,
 * nothing. The reader concludes the paper is not accepting pitches.
 *
 * So the primary button is Gmail's web composer, which is a URL like any
 * other: it opens in a tab, needs no handler, and every reader of this paper
 * already has the Workspace account it signs them into. The `mailto:` is kept
 * underneath for the people it does work for — it is the better experience
 * when it works, it just cannot be the only one.
 *
 * ── And why the address is copyable
 * Because both routes can still fail — signed into a personal Google account,
 * clipboard blocked, a browser that opens neither — and the last resort for
 * "the button did nothing" has to be a way to get the address by hand without
 * transcribing it off the screen.
 */
export function PitchActions({
  email,
  subject,
  body,
}: {
  email: string;
  subject: string;
  body: string;
}) {
  const [copied, setCopied] = useState(false);

  /* Two encodings of the same prompt, and they genuinely differ.
     `mailto:` is RFC 6068 and wants CRLF; Gmail's composer is an ordinary web
     form that takes the parameter as typed, where a stray CR is one more
     character in the textarea rather than a line break. Sending each the
     breaks it asks for costs one `replace`. */
  const gmail =
    "https://mail.google.com/mail/?view=cm&fs=1" +
    `&to=${encodeURIComponent(email)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body.replace(/\r\n/g, "\n"))}`;

  const mailto =
    `mailto:${email}?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard refused — an insecure origin, or permission denied. The
         address is printed right there, so there is still a way through. */
      setCopied(false);
    }
  };

  return (
    <>
      <a
        href={gmail}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-9 inline-flex items-center gap-5 bg-red px-8 py-5 text-paper transition-colors duration-300 hover:bg-ink"
      >
        <span className="label-lg">Pitch a story</span>
        <svg
          width="24"
          height="12"
          viewBox="0 0 24 12"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1.5"
        >
          <path d="M0 6h22M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </a>

      {/* The two ways round it, set as one quiet line under the button —
          nobody who is about to click the red thing needs to read this, and
          anyone for whom the red thing failed needs it immediately. */}
      <p className="meta mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <span>Opens Gmail, already filled in. Or</span>
        <a href={mailto} className="link-draw text-ink">
          use your own mail app
        </a>
        <span aria-hidden="true" className="opacity-40">
          /
        </span>
        <button
          type="button"
          onClick={copy}
          className="link-draw text-ink"
          /* The label changes under the reader's cursor, so the change has to
             be announced rather than only shown. */
          aria-live="polite"
        >
          {copied ? "Address copied" : `Copy ${email}`}
        </button>
      </p>
    </>
  );
}
