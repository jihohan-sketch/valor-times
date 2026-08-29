"use client";

import { useEffect, useRef, useState } from "react";

import { useEngagement } from "@/components/engagement/EngagementProvider";
import { BODY_MAX, NAME_MAX } from "@/lib/engagement/limits";
import { readerName, rememberName } from "@/lib/engagement/visitor";
import { timeAgo } from "@/lib/format";

/**
 * The thread at the foot of a story.
 *
 * There is no account to make and no password to forget: a reader types a name
 * if they want one, writes, and posts. Their browser remembers who they were
 * well enough to let them delete their own comment later, and nothing else is
 * kept. The form is deliberately plain — a rule, a field, a button — because a
 * comment box that looks like a product feature invites performance, and one
 * that looks like a letters page invites letters.
 */
export function Comments() {
  const { comments, ready, comment, remove } = useEngagement();

  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const field = useRef<HTMLTextAreaElement>(null);
  const nameField = useRef<HTMLInputElement>(null);

  /* The name is uncontrolled: it is restored into the DOM once on mount, which
     keeps the server's empty field and the client's remembered one from
     disagreeing at hydration. */
  useEffect(() => {
    const remembered = readerName();
    if (remembered && nameField.current) nameField.current.value = remembered;
  }, []);

  // "just now" should not still say that ten minutes later.
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(tick);
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending || body.trim().length === 0) return;

    const name = nameField.current?.value ?? "";

    setSending(true);
    setError(null);
    const failure = await comment({ name, body });
    setSending(false);

    if (failure) {
      setError(failure);
      return;
    }
    rememberName(name);
    setBody("");
    field.current?.blur();
  };

  const remaining = BODY_MAX - body.length;

  return (
    <section className="mt-16 border-t-2 border-ink pt-7" aria-labelledby="comments">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="comments" className="display text-2xl md:text-3xl">
          Letters
        </h2>
        <p className="meta tabular-nums">
          {ready
            ? `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`
            : "Loading"}
        </p>
      </div>

      <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-2">
        Say something about this story. No account needed — leave a name or stay
        anonymous, and you can delete anything you post from this browser.
      </p>

      {/* ── Write ── */}
      <form onSubmit={submit} className="mt-7">
        <div className="border border-rule-2 transition-colors focus-within:border-ink">
          <label htmlFor="comment-name" className="sr-only">
            Your name
          </label>
          <input
            id="comment-name"
            ref={nameField}
            defaultValue=""
            maxLength={NAME_MAX}
            placeholder="Your name (optional)"
            autoComplete="name"
            className="w-full border-b border-rule bg-transparent px-4 py-3 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-muted"
          />

          <label htmlFor="comment-body" className="sr-only">
            Your comment
          </label>
          <textarea
            id="comment-body"
            ref={field}
            value={body}
            onChange={(event) => setBody(event.target.value.slice(0, BODY_MAX))}
            rows={4}
            placeholder="Write your comment…"
            className="w-full resize-y bg-transparent px-4 py-3 text-[0.95rem] leading-relaxed outline-none placeholder:text-muted"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="submit"
            disabled={sending || body.trim().length === 0}
            className="kicker border-b-2 border-ink pb-2 transition-colors hover:text-red disabled:border-rule-2 disabled:text-muted disabled:hover:text-muted"
          >
            {sending ? "Posting…" : "Post comment"}
          </button>

          <span
            className={`meta tabular-nums ml-auto ${remaining < 100 ? "text-red" : ""}`}
            aria-live="polite"
          >
            {remaining < 200 ? `${remaining} left` : ""}
          </span>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red" role="alert">
            {error}
          </p>
        )}
      </form>

      {/* ── Read ── */}
      {comments.length > 0 && (
        <ol className="mt-12">
          {comments.map((entry) => (
            <li key={entry.id} className="border-t border-rule py-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="text-sm font-semibold">{entry.name}</p>
                <p className="meta tabular-nums">{timeAgo(entry.createdAt, now)}</p>
                {entry.mine && (
                  <button
                    type="button"
                    onClick={() => void remove(entry.id)}
                    className="meta ml-auto transition-colors hover:text-red"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-2.5 whitespace-pre-line text-[0.975rem] leading-relaxed text-ink-2">
                {entry.body}
              </p>
            </li>
          ))}
        </ol>
      )}

      {ready && comments.length === 0 && (
        <p className="mt-10 border-t border-rule pt-6 text-sm text-muted">
          No comments yet. Yours would be the first.
        </p>
      )}
    </section>
  );
}
