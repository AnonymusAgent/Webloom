import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { getSettings, setSetting } from "@/lib/data";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ settings: await getSettings() });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (typeof body.contactEmail === "string") {
    const email = body.contactEmail.trim().slice(0, 160);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    await setSetting("contactEmail", email);
  }
  if (Array.isArray(body.socials)) {
    const socials = body.socials
      .filter((s: unknown) => s && typeof s === "object")
      .map((s: { label?: unknown; href?: unknown }) => ({
        label: typeof s.label === "string" ? s.label.trim().slice(0, 30) : "",
        href: typeof s.href === "string" ? s.href.trim().slice(0, 200) : "",
      }))
      .filter((s: { label: string; href: string }) => s.label && /^https?:\/\//.test(s.href));
    await setSetting("socials", socials);
  }
  revalidateTag("site-settings", { expire: 0 });
  return NextResponse.json({ ok: true });
}
