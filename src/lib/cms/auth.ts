import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "vt_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "valortimes";
}

function sign(payload: string) {
  return createHmac("sha256", adminPassword()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyPassword(password: string) {
  return safeEqual(password, adminPassword());
}

export function createSessionToken() {
  const expiresAt = String(Date.now() + MAX_AGE_SECONDS * 1000);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function isSessionTokenValid(token: string | undefined) {
  if (!token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (!safeEqual(signature, sign(expiresAt))) return false;
  return Date.now() < Number(expiresAt);
}

export async function isAdminRequest() {
  const jar = await cookies();
  return isSessionTokenValid(jar.get(ADMIN_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS,
  };
}
