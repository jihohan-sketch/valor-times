#!/usr/bin/env node
/**
 * Mints the Gmail refresh token the news email sends with.
 *
 *   1. Put GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET (a "Desktop app" OAuth
 *      client from Google Cloud, Gmail API enabled) in .env.local.
 *   2. node scripts/gmail-auth.mjs
 *   3. Sign in as timesvalor@gmail.com in the browser window that opens.
 *
 * The token is written into .env.local (git-ignored) and never printed, so it
 * does not end up in a terminal log or a chat. Copy it to Vercel with
 * `vercel env add GMAIL_REFRESH_TOKEN production`.
 *
 * Scopes: gmail.send (send only — it cannot read the inbox) plus openid/email,
 * used once here to confirm which account actually signed in.
 */
import { execFile } from "node:child_process";
import { randomBytes, createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";

const ENV_FILE = ".env.local";
const EXPECTED = (process.env.NEWS_EMAIL_FROM || "timesvalor@gmail.com").toLowerCase();

function readEnv() {
  if (!existsSync(ENV_FILE)) return {};
  return Object.fromEntries(
    readFileSync(ENV_FILE, "utf8")
      .split("\n")
      .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.replace(/^["']|["']$/g, "")]),
  );
}

function upsertEnv(key, value) {
  const lines = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8").split("\n") : [];
  const index = lines.findIndex((line) => line.startsWith(`${key}=`));
  if (index >= 0) lines[index] = `${key}=${value}`;
  else lines.splice(lines.at(-1) === "" ? lines.length - 1 : lines.length, 0, `${key}=${value}`);
  writeFileSync(ENV_FILE, `${lines.join("\n").replace(/\n*$/, "")}\n`);
}

/** Gmail treats dots in the local part as insignificant. */
const canonical = (address) => {
  const [local, domain] = address.toLowerCase().split("@");
  return domain === "gmail.com" ? `${local.replace(/\./g, "")}@${domain}` : address.toLowerCase();
};

const env = { ...readEnv(), ...process.env };
const clientId = env.GMAIL_CLIENT_ID;
const clientSecret = env.GMAIL_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error(`Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in ${ENV_FILE} first.`);
  process.exit(1);
}

const verifier = randomBytes(32).toString("base64url");
const challenge = createHash("sha256").update(verifier).digest("base64url");
const state = randomBytes(16).toString("hex");

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (url.pathname !== "/callback") return res.writeHead(404).end();

  const finish = (message, code) => {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }).end(message);
    console.log(message);
    server.close();
    process.exitCode = code;
  };

  if (url.searchParams.get("state") !== state) return finish("State mismatch — try again.", 1);
  const code = url.searchParams.get("code");
  if (!code) return finish(`Google said: ${url.searchParams.get("error") ?? "no code"}`, 1);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      code_verifier: verifier,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });
  const tokens = await response.json();
  if (!response.ok || !tokens.refresh_token) {
    return finish(`Token exchange failed: ${tokens.error ?? response.status} ${tokens.error_description ?? ""}`, 1);
  }

  const claims = JSON.parse(Buffer.from(tokens.id_token.split(".")[1], "base64url").toString());
  if (canonical(claims.email) !== canonical(EXPECTED)) {
    return finish(`Signed in as ${claims.email}, not ${EXPECTED}. Nothing saved — run again and pick ${EXPECTED}.`, 1);
  }

  // Google's consent screen gives each scope its own checkbox; an unticked
  // "Send email on your behalf" still yields a token, just one that cannot send.
  if (!String(tokens.scope ?? "").split(" ").includes("https://www.googleapis.com/auth/gmail.send")) {
    return finish(
      `Signed in as ${claims.email}, but "Send email on your behalf" was not granted. Nothing saved — run again and tick that box.`,
      1,
    );
  }

  upsertEnv("GMAIL_REFRESH_TOKEN", tokens.refresh_token);
  finish(`Signed in as ${claims.email}. GMAIL_REFRESH_TOKEN saved to ${ENV_FILE}. You can close this tab.`, 0);
});

let redirectUri;
server.listen(0, "127.0.0.1", () => {
  redirectUri = `http://127.0.0.1:${server.address().port}/callback`;
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.send openid email",
    access_type: "offline",
    prompt: "consent",
    login_hint: EXPECTED,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
  }).toString();
  console.log(`Opening the Google sign-in page. If nothing opens, visit:\n${auth}\n`);
  execFile(process.platform === "darwin" ? "open" : "xdg-open", [auth.toString()], () => {});
});
