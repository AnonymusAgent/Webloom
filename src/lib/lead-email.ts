import "server-only";
import type { Lead } from "@/db/schema";
import { SITE } from "@/lib/site";

type Decision = "accepted" | "rejected";

export type LeadEmailResult =
  | { sent: true }
  | { sent: false; reason: "not_configured" | "invalid_email" | "provider_error" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BREVO_EMAIL_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

function parseMailbox(value: string) {
  const formatted = value.trim().match(/^(.*?)\s*<([^<>]+)>$/);
  const email = (formatted?.[2] ?? value).trim();
  if (!EMAIL_PATTERN.test(email)) return null;
  const name = formatted?.[1].trim().replace(/^"|"$/g, "");
  return { email, ...(name ? { name } : {}) };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function sendLeadDecisionEmail(
  lead: Lead,
  decision: Decision
): Promise<LeadEmailResult> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) return { sent: false, reason: "not_configured" };

  const recipient = parseMailbox(lead.email);
  const sender = parseMailbox(from);
  const replyTo = parseMailbox(process.env.EMAIL_REPLY_TO?.trim() || SITE.email);
  if (!recipient || !sender || !replyTo) return { sent: false, reason: "invalid_email" };

  const name = lead.name.trim() || "there";
  const projectType = lead.projectType.trim() || "Project brief";
  const reference = lead.id.slice(0, 8).toUpperCase();
  const accepted = decision === "accepted";
  const subject = accepted
    ? "Your Webloom Project Brief Has Been Accepted"
    : "Update Regarding Your Webloom Project Brief";
  const heading = accepted ? "Your project brief has been accepted" : "An update on your project brief";
  const message = accepted
    ? "We’re pleased to let you know that we can move forward with your brief. Our next step is to follow up about discovery, scope, timing, and a written proposal before any work begins."
    : "Thank you for sharing your project with us. After reviewing the brief, we’re unable to take it forward at this time. We appreciate your interest in Webloom and wish you the best with your project."
  ;
  const safeName = escapeHtml(name);
  const safeProjectType = escapeHtml(projectType);

  const text = [
    `Hello ${name},`,
    "",
    heading,
    "",
    message,
    "",
    `Project type: ${projectType}`,
    `Reference: ${reference}`,
    `Status: ${accepted ? "Accepted" : "Rejected"}`,
    "",
    "Webloom | Digital products, built beautifully.",
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4f7f5;color:#142019;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7f5;padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #dce7e0;border-radius:16px;overflow:hidden;">
          <tr><td style="background:#0b1711;padding:24px 32px;color:#ffffff;font-size:17px;font-weight:700;">Webloom <span style="color:#5ee0a6;font-weight:400;">/ Project update</span></td></tr>
          <tr><td style="padding:36px 32px 24px;">
            <p style="margin:0 0 12px;color:#16865a;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${accepted ? "Brief accepted" : "Project update"}</p>
            <h1 style="margin:0 0 20px;color:#142019;font-size:26px;line-height:1.25;">${heading}</h1>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">Hello ${safeName},</p>
            <p style="margin:0 0 24px;color:#45534a;font-size:15px;line-height:1.7;">${message}</p>
            <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;background:#f4f7f5;border-radius:10px;">
              <tr><td style="padding:12px 16px;color:#65736a;font-size:13px;">Project type</td><td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:600;">${safeProjectType}</td></tr>
              <tr><td style="padding:12px 16px;color:#65736a;font-size:13px;border-top:1px solid #dce7e0;">Reference</td><td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:600;border-top:1px solid #dce7e0;">${reference}</td></tr>
              <tr><td style="padding:12px 16px;color:#65736a;font-size:13px;border-top:1px solid #dce7e0;">Status</td><td style="padding:12px 16px;text-align:right;color:#16865a;font-size:13px;font-weight:700;border-top:1px solid #dce7e0;">${accepted ? "Accepted" : "Rejected"}</td></tr>
            </table>
            <p style="margin:28px 0 0;color:#45534a;font-size:14px;line-height:1.65;">Thank you for considering Webloom. If you have questions, reply to this email.</p>
          </td></tr>
          <tr><td style="border-top:1px solid #e5ece7;padding:18px 32px;color:#718078;font-size:12px;line-height:1.6;">Webloom · Digital products, built beautifully.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  try {
    const response = await fetch(BREVO_EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender,
        to: [recipient],
        replyTo,
        subject,
        textContent: text,
        htmlContent: html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok
      ? { sent: true }
      : { sent: false, reason: "provider_error" };
  } catch {
    return { sent: false, reason: "provider_error" };
  }
}