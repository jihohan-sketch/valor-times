import nodemailer from "nodemailer";

/**
 * Sends one message through Gmail's SMTP server as the paper's own account,
 * signed in with a Gmail App Password (Google Account → Security → 2-Step
 * Verification → App passwords). Both values live in the environment and are
 * read server-side only; see `.env.example`.
 */

export interface OutgoingEmail {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
}

type SmtpConfig = { user: string; pass: string };

export function smtpConfig(): SmtpConfig | { error: string } {
  const user = process.env.GMAIL_USER ?? "";
  // Google shows the password in groups of four; the spaces are not part of it.
  const pass = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "");
  const missing = [!user && "GMAIL_USER", !pass && "GMAIL_APP_PASSWORD"].filter(Boolean);
  if (missing.length) return { error: `${missing.join(", ")} not set` };
  return { user, pass };
}

/** Resolves with the SMTP message id; throws with a readable reason. */
export async function sendMail(email: OutgoingEmail): Promise<string> {
  const config = smtpConfig();
  if ("error" in config) throw new Error(`Email is not configured: ${config.error}.`);

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: config.user, pass: config.pass },
  });

  try {
    const info = await transport.sendMail({
      from: email.from,
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
    return info.messageId;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    // EAUTH almost always means a wrong or revoked app password, or 2-Step
    // Verification switched off on the account.
    throw new Error(`Gmail SMTP send failed: ${reason}`);
  } finally {
    transport.close();
  }
}
