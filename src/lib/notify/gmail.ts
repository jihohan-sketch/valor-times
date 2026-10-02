/**
 * Sends one message through the Gmail API as the paper's own account.
 *
 * OAuth only — there is no password anywhere. A long-lived refresh token for
 * timesvalor@gmail.com (scope `gmail.send`, nothing broader) is traded for a
 * short-lived access token on every send. All three values live in the
 * environment and are read server-side; see `.env.example` and
 * `scripts/gmail-auth.mjs` for how to mint them.
 */

export interface OutgoingEmail {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
}

type GmailConfig = { clientId: string; clientSecret: string; refreshToken: string };

export function gmailConfig(): GmailConfig | { error: string } {
  const clientId = process.env.GMAIL_CLIENT_ID ?? "";
  const clientSecret = process.env.GMAIL_CLIENT_SECRET ?? "";
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN ?? "";
  const missing = [
    !clientId && "GMAIL_CLIENT_ID",
    !clientSecret && "GMAIL_CLIENT_SECRET",
    !refreshToken && "GMAIL_REFRESH_TOKEN",
  ].filter(Boolean);
  if (missing.length) return { error: `${missing.join(", ")} not set` };
  return { clientId, clientSecret, refreshToken };
}

async function accessToken(config: GmailConfig) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
    }),
  });
  const body = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!response.ok || !body.access_token) {
    // `invalid_grant` almost always means the refresh token was revoked or,
    // with the OAuth app still in "Testing", expired after seven days.
    throw new Error(
      `Gmail token refresh failed (${response.status}): ${body.error ?? "unknown"} ${body.error_description ?? ""}`.trim(),
    );
  }
  return body.access_token;
}

/** RFC 2047 encoded-word, so the emoji in the subject survives every client. */
function encodeHeader(value: string) {
  return /^[\x20-\x7e]*$/.test(value)
    ? value
    : `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function base64Lines(value: string) {
  return Buffer.from(value, "utf8").toString("base64").replace(/.{76}/g, "$&\r\n");
}

export function buildMime(email: OutgoingEmail) {
  const boundary = `vt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return [
    `From: ${encodeHeader("Valor Times")} <${email.from}>`,
    `To: ${email.to.join(", ")}`,
    `Subject: ${encodeHeader(email.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    base64Lines(email.text),
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    base64Lines(email.html),
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

/** Resolves with the Gmail message id; throws with a readable reason. */
export async function sendGmail(email: OutgoingEmail): Promise<string> {
  const config = gmailConfig();
  if ("error" in config) throw new Error(`Gmail is not configured: ${config.error}.`);

  const token = await accessToken(config);
  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw: Buffer.from(buildMime(email), "utf8").toString("base64url") }),
    },
  );
  const body = (await response.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };
  if (!response.ok || !body.id) {
    throw new Error(
      `Gmail send failed (${response.status}): ${body.error?.message ?? "no message id returned"}`,
    );
  }
  return body.id;
}
