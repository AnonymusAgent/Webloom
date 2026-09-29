import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/data";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function externalOrigin(value: unknown) {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : undefined;
  } catch {
    return undefined;
  }
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    if (!rateLimit(`track:${ip}`, 240, 60 * 1000)) {
      return NextResponse.json({ ok: true }); // silently drop
    }
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    const type = body.type === "event" ? "event" : "pageview";
    const path = typeof body.path === "string" ? body.path : "/";
    if (path.startsWith("/admin")) return NextResponse.json({ ok: true });

    await trackEvent({
      type,
      name: typeof body.name === "string" ? body.name.slice(0, 120) : undefined,
      path,
      referrer: externalOrigin(body.referrer),
      meta:
        body.meta && typeof body.meta === "object"
          ? (body.meta as Record<string, unknown>)
          : undefined,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
