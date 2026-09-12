import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * The newsroom desk lock.
 *
 * Two secrets, both required, both supplied by the environment:
 *
 *   ADMIN_PASSWORD  what an editor types to get in.
 *   SESSION_SECRET  the key the session cookie is signed with.
 *
 * They are deliberately separate. Signing the cookie with the password itself
 * means anyone who ever sees one issued cookie can brute-force the password
 * offline, at whatever rate their hardware allows, with no request ever
 * reaching this server — the online rate limit cannot see an attack it is not
 * part of. A long random SESSION_SECRET has no such shortcut.
 *
 * There is no default for either. A fallback password in the source is a
 * published password: this repository is public, and a reader who can see the
 * fallback can file, rewrite and delete stories. When a secret is missing the
 * desk is closed — the public paper is untouched, and every admin route
 * answers 503 with the reason.
 */

export const ADMIN_COOKIE = "vt_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

const MIN_PASSWORD_LENGTH = 12;
const MIN_SECRET_LENGTH = 32;

type Config = { password: string; secret: string };

function config(): Config | { error: string } {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.SESSION_SECRET ?? "";

  if (!password) {
    return { error: "ADMIN_PASSWORD is not set; the newsroom desk is closed." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters; the desk is closed.`,
    };
  }
  if (!secret) {
    return { error: "SESSION_SECRET is not set; the newsroom desk is closed." };
  }
  if (secret.length < MIN_SECRET_LENGTH) {
    return {
      error: `SESSION_SECRET must be at least ${MIN_SECRET_LENGTH} characters; the desk is closed.`,
    };
  }

  return { password, secret };
}

/** The reason the desk is closed, or null when it is open for business. */
export function authConfigError(): string | null {
  const resolved = config();
  return "error" in resolved ? resolved.error : null;
}

function digest(secret: string, payload: string) {
  return createHmac("sha256", secret).update(payload).digest();
}

function equal(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Compares HMACs rather than the passwords themselves. `timingSafeEqual`
 * throws on a length mismatch, so the obvious guard — return false when the
 * lengths differ — answers before it compares anything and hands back the
 * length of the real password. Two HMACs are always 32 bytes.
 */
export function verifyPassword(candidate: string) {
  const resolved = config();
  if ("error" in resolved) return false;
  return equal(
    digest(resolved.secret, candidate),
    digest(resolved.secret, resolved.password),
  );
}

/** Null when the desk is closed — there is no session to hand out. */
export function createSessionToken(): string | null {
  const resolved = config();
  if ("error" in resolved) return null;

  const expiresAt = String(Date.now() + MAX_AGE_SECONDS * 1000);
  // A nonce so two sessions minted in the same millisecond are still distinct.
  const nonce = randomBytes(9).toString("base64url");
  const payload = `${expiresAt}.${nonce}`;
  return `${payload}.${digest(resolved.secret, payload).toString("hex")}`;
}

export function isSessionTokenValid(token: string | undefined) {
  const resolved = config();
  if ("error" in resolved || !token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expiresAt, nonce, signature] = parts;

  const expected = digest(resolved.secret, `${expiresAt}.${nonce}`).toString("hex");
  if (!equal(Buffer.from(signature), Buffer.from(expected))) return false;

  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && Date.now() < expiry;
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
