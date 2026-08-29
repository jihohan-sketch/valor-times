"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { primeCounts } from "@/lib/engagement/counts";
import { firstVisitThisSession, visitorId } from "@/lib/engagement/visitor";

export interface PublicComment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
  mine: boolean;
}

interface Engagement {
  views: number;
  likes: number;
  liked: boolean;
  comments: PublicComment[];
}

interface EngagementValue extends Engagement {
  slug: string;
  ready: boolean;
  like: () => Promise<void>;
  comment: (input: { name: string; body: string }) => Promise<string | null>;
  remove: (id: string) => Promise<string | null>;
}

const EMPTY: Engagement = { views: 0, likes: 0, liked: false, comments: [] };

const Context = createContext<EngagementValue | null>(null);

/**
 * One story's readership, shared by every control that shows or changes it —
 * the counter under the headline, the like button, the thread at the foot.
 * They read from a single fetch and a single piece of state, so a like posted
 * at the bottom of the page moves the number at the top.
 *
 * The article itself is statically rendered; all of this arrives afterwards,
 * which is why the panel is a client island rather than part of the page.
 */
export function EngagementProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<Engagement>(EMPTY);
  const [ready, setReady] = useState(false);
  const reader = useRef("");

  const absorb = useCallback(
    (next: Engagement) => {
      setState(next);
      primeCounts(slug, {
        views: next.views,
        likes: next.likes,
        comments: next.comments.length,
      });
    },
    [slug],
  );

  // Arrival: count the view once per tab, and read back the panel either way.
  useEffect(() => {
    let live = true;
    reader.current = visitorId();

    const load = async () => {
      const counting = firstVisitThisSession(slug);
      try {
        const response = counting
          ? await fetch(`/api/engagement/${encodeURIComponent(slug)}`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ visitorId: reader.current }),
            })
          : await fetch(
              `/api/engagement/${encodeURIComponent(slug)}?visitor=${reader.current}`,
            );
        if (!response.ok) return;
        const data = (await response.json()) as Engagement;
        if (live) absorb(data);
      } catch {
        // Offline or blocked: the story still reads, the panel stays quiet.
      } finally {
        if (live) setReady(true);
      }
    };

    void load();
    return () => {
      live = false;
    };
  }, [slug, absorb]);

  /** Posts, then replaces state with whatever the server says is true. */
  const send = useCallback(
    async (path: string, method: "POST" | "DELETE", payload: object = {}) => {
      const response = await fetch(path, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, visitorId: reader.current }),
      });
      const data = (await response.json().catch(() => null)) as
        | (Engagement & { error?: string })
        | null;

      if (!response.ok) return data?.error ?? "That did not go through.";
      if (data) absorb(data);
      return null;
    },
    [absorb],
  );

  const like = useCallback(async () => {
    // Optimistic: a like should land the instant it is pressed.
    setState((current) => ({
      ...current,
      liked: !current.liked,
      likes: current.likes + (current.liked ? -1 : 1),
    }));
    const error = await send(
      `/api/engagement/${encodeURIComponent(slug)}/like`,
      "POST",
    );
    if (error) {
      setState((current) => ({
        ...current,
        liked: !current.liked,
        likes: current.likes + (current.liked ? -1 : 1),
      }));
    }
  }, [slug, send]);

  const comment = useCallback(
    (input: { name: string; body: string }) =>
      send(`/api/engagement/${encodeURIComponent(slug)}/comments`, "POST", input),
    [slug, send],
  );

  const remove = useCallback(
    (id: string) =>
      send(
        `/api/engagement/${encodeURIComponent(slug)}/comments/${encodeURIComponent(id)}`,
        "DELETE",
      ),
    [slug, send],
  );

  const value = useMemo<EngagementValue>(
    () => ({ ...state, slug, ready, like, comment, remove }),
    [state, slug, ready, like, comment, remove],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useEngagement(): EngagementValue {
  const value = useContext(Context);
  if (!value) {
    throw new Error("Engagement controls must sit inside an EngagementProvider.");
  }
  return value;
}
