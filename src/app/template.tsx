/**
 * Remounts on every navigation, which gives each page a short rise-in.
 * Kept deliberately quiet — a long transition on a news site reads as lag.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-rise">{children}</div>;
}
