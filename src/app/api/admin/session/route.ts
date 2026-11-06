import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { adminPassword, COOKIE, createToken, isAdmin, isAdminConfigured } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { log } from "@/lib/data";

export const runtime = "nodejs";

function setSessionCookie(response: NextResponse) {
  // No Max-Age or Expires: the browser discards the cookie on browser close.
  // The signed token itself expires after five minutes without renewal.
  response.cookies.set(COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}

export async function GET() {
  return NextResponse.json({ admin: await isAdmin() }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Session expired." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return setSessionCookie(NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } }));
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production" && !isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin authentication is not configured." },
      { status: 503 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  if (!rateLimit(`login:${ip}`, 8, 15 * 60 * 1000)) {
    await log("security", "admin_login_rate_limited");
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  const expected = adminPassword();
  const a = Buffer.from(password.padEnd(expected.length).slice(0, expected.length));
  const b = Buffer.from(expected);
  const ok = password.length === expected.length && timingSafeEqual(a, b);

  if (!ok) {
    await log("security", "admin_login_failed");
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = setSessionCookie(NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } }));
  await log("security", "admin_login_success");
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set(COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 0, path: "/" });
  return res;
}
