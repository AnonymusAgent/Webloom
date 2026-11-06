/* Run against a local server with disposable ADMIN_PASSWORD / ADMIN_SECRET. */
import assert from "node:assert/strict";
import { ADMIN_IDLE_MS, createAdminToken } from "../src/lib/admin-token.ts";

const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const password = process.env.TEST_ADMIN_PASSWORD;
const secret = process.env.TEST_ADMIN_SECRET;
if (!password || !secret) throw new Error("Set TEST_ADMIN_PASSWORD and TEST_ADMIN_SECRET to the disposable values used by the local server.");
const route = new URL("/api/admin/session", base);
const login = await fetch(route, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password }),
});
assert.equal(login.status, 200);
const setCookie = login.headers.get("set-cookie") || "";
assert.match(setCookie, /wl_admin=/);
assert.doesNotMatch(setCookie, /max-age=|expires=/i, "Admin cookie should end with the browser session");
const cookie = setCookie.split(";")[0];
const payload = JSON.parse(Buffer.from(cookie.split("=")[1].split(".")[0], "base64url").toString());
assert.ok(payload.exp > Date.now() && payload.exp <= Date.now() + 5 * 60 * 1000);
const initial = await fetch(route, { headers: { Cookie: cookie } });
assert.deepEqual(await initial.json(), { admin: true });
const renewal = await fetch(route, { method: "PATCH", headers: { Cookie: cookie } });
assert.equal(renewal.status, 200);
assert.match(renewal.headers.get("set-cookie") || "", /wl_admin=/);
assert.doesNotMatch(renewal.headers.get("set-cookie") || "", /max-age=|expires=/i);
const anonymousRenewal = await fetch(route, { method: "PATCH" });
assert.equal(anonymousRenewal.status, 401);
const expired = `wl_admin=${createAdminToken(secret, Date.now() - ADMIN_IDLE_MS - 1)}`;
const expiredCheck = await fetch(route, { headers: { Cookie: expired } });
assert.deepEqual(await expiredCheck.json(), { admin: false });
const expiredRenewal = await fetch(route, { method: "PATCH", headers: { Cookie: expired } });
assert.equal(expiredRenewal.status, 401);
const protectedRoute = await fetch(new URL("/api/admin/github", base), { headers: { Cookie: expired } });
assert.equal(protectedRoute.status, 401, "Expired token must not access protected admin APIs");
const signout = await fetch(route, { method: "DELETE", headers: { Cookie: cookie } });
assert.equal(signout.status, 200);
assert.match(signout.headers.get("set-cookie") || "", /max-age=0/i);
console.log("Admin login uses a browser-session cookie, renewal requires authentication, and logout clears the cookie.");
