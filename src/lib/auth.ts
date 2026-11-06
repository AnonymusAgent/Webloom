import { cookies } from "next/headers";
import { createAdminToken, verifyAdminToken } from "@/lib/admin-token";

const COOKIE = "wl_admin";

function secret() {
  if (process.env.ADMIN_SECRET) return process.env.ADMIN_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SECRET must be configured in production.");
  }
  return process.env.ADMIN_PASSWORD || "webloom-dev-secret";
}

export function adminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_PASSWORD must be configured in production.");
  }
  return "webloom";
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET);
}

export function createToken() {
  return createAdminToken(secret());
}

export function verifyToken(token?: string | null) {
  if (!token || (process.env.NODE_ENV === "production" && !isAdminConfigured())) return false;
  return verifyAdminToken(token, secret());
}

export async function isAdmin() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}

export { COOKIE };
