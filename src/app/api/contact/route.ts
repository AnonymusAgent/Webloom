import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { log, trackEvent } from "@/lib/data";
import { BUDGETS, PROJECT_TYPES, TIMELINES } from "@/lib/site";

export const runtime = "nodejs";

const clean = (v: unknown, max = 200) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    if (!rateLimit(`contact:${ip}`, 6, 60 * 60 * 1000)) {
      await log("warn", "contact_rate_limited");
      return NextResponse.json(
        { error: "Too many submissions. Please try again later or email us directly." },
        { status: 429 }
      );
    }

    if (Number(req.headers.get("content-length")) > 10_000) {
      return NextResponse.json({ error: "Your brief is too long." }, { status: 413 });
    }
    const raw = await req.text();
    if (raw.length > 10_000) {
      return NextResponse.json({ error: "Your brief is too long." }, { status: 413 });
    }
    let body: Record<string, unknown> | null;
    try {
      body = JSON.parse(raw || "null") as Record<string, unknown> | null;
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // Honeypot: genuine visitors never interact with this hidden field.
    if (body.website) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const name = clean(body.name, 120);
    const company = clean(body.company, 120);
    const email = clean(body.email, 160);
    const phone = clean(body.phone, 40);
    const projectType = clean(body.projectType, 80);
    const budget = clean(body.budget, 40);
    const timeline = clean(body.timeline, 40);
    const message = clean(body.message, 4000);

    if (name.length < 2) {
      return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    if (!PROJECT_TYPES.includes(projectType)) {
      return NextResponse.json({ error: "Please select a project type." }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json(
        { error: "Please tell us a little more about your project." },
        { status: 400 }
      );
    }

    await db.insert(leads).values({
      name,
      company: company || null,
      email,
      phone: phone || null,
      projectType,
      budget: BUDGETS.includes(budget) ? budget : null,
      timeline: TIMELINES.includes(timeline) ? timeline : null,
      message,
      status: "new",
      source: "contact",
    });

    await Promise.all([
      log("info", "lead_created", { projectType, budget }),
      trackEvent({ type: "event", name: "form_success", path: "/contact" }),
    ]);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    await log("error", "contact_error");
    return NextResponse.json(
      { error: "We couldn't send your brief. Please try again." },
      { status: 500 }
    );
  }
}
