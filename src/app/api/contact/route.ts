import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { log } from "@/lib/data";
import { BUDGETS, PROJECT_TYPES, TIMELINES } from "@/lib/site";

export const runtime = "nodejs";

const clean = (v: unknown, max = 200) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    if (!rateLimit(`contact:${ip}`, 6, 60 * 60 * 1000)) {
      await log("warn", "contact_rate_limited", { ip });
      return NextResponse.json(
        { error: "Too many submissions. Please try again later or email us directly." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
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

    await log("info", "lead_created", { projectType, budget });
    return NextResponse.json({ ok: true });
  } catch (err) {
    await log("error", "contact_error", {
      error: err instanceof Error ? err.message : "unknown",
    });
    return NextResponse.json(
      { error: "We couldn't send your brief. Please try again." },
      { status: 500 }
    );
  }
}
