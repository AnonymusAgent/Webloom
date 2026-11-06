import { createHmac, timingSafeEqual } from "node:crypto";
import policy from "./admin-session-policy.json" with { type: "json" };

// The browser renews this short-lived token only after real activity in /admin.
export const ADMIN_IDLE_MS = policy.idleMs;

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAdminToken(secret: string, now = Date.now()) {
  const payload = Buffer.from(
    JSON.stringify({ sub: "admin", v: 2, iat: now, exp: now + ADMIN_IDLE_MS })
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyAdminToken(token: string | null | undefined, secret: string, now = Date.now()) {
  if (!token) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;
  const expected = sign(payload, secret);
  const actualBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  if (actualBytes.length !== expectedBytes.length || !timingSafeEqual(actualBytes, expectedBytes)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    // Reject pre-upgrade 12-hour cookies; only the five-minute format is valid.
    return data.sub === "admin" && data.v === 2 && typeof data.iat === "number" &&
      typeof data.exp === "number" && data.exp - data.iat === ADMIN_IDLE_MS &&
      data.exp > now;
  } catch {
    return false;
  }
}
