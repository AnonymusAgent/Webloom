import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "wl_admin";
const MAX_AGE = 60 * 60 * 12; // 12h

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "webloom-dev-secret";
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "webloom";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createToken() {
  const payload = Buffer.from(
    JSON.stringify({ sub: "admin", exp: Date.now() + MAX_AGE * 1000 })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token?: string | null) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.sub === "admin" && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdmin() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}

export { COOKIE, MAX_AGE };
