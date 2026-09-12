/**
 * The address a request came from, as the only identity an anonymous caller
 * has that they do not simply mint themselves.
 *
 * `x-forwarded-for` is a header, so it is forgeable by anyone talking straight
 * to the origin. Behind Vercel it is not: the proxy overwrites it, and the
 * left-most entry is the real client. That makes it trustworthy in production
 * and worthless if this app is ever exposed directly — worth knowing before
 * moving it somewhere else.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
