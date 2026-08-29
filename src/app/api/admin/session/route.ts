import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE,
  createSessionToken,
  isAdminRequest,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/cms/auth";

export async function GET() {
  return NextResponse.json({ ok: await isAdminRequest() });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (!verifyPassword(String(body?.password ?? ""))) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
