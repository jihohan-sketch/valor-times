import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE,
  authConfigError,
  createSessionToken,
  isAdminRequest,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/cms/auth";
import { createRateLimiter } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request-ip";

/**
 * Ten tries a quarter hour, then a quarter hour shut out. A real editor
 * fumbling their password never reaches ten; a script working through a
 * wordlist needs weeks to make a dent, which is the difference between a
 * password being a lock and a password being a formality.
 */
const loginLimiter = createRateLimiter({
  limit: 10,
  windowMs: 15 * 60 * 1000,
  blockMs: 15 * 60 * 1000,
});

export async function GET() {
  return NextResponse.json({ ok: await isAdminRequest() });
}

export async function POST(request: Request) {
  const configError = authConfigError();
  if (configError) {
    return NextResponse.json({ error: configError }, { status: 503 });
  }

  const ip = clientIp(request);
  const limit = loginLimiter.hit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (!verifyPassword(String(body?.password ?? ""))) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const token = createSessionToken();
  if (!token) {
    return NextResponse.json({ error: "The newsroom desk is closed." }, { status: 503 });
  }

  // A good password clears the count, so an editor who mistyped four times is
  // not still carrying those four into tomorrow.
  loginLimiter.reset(ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
