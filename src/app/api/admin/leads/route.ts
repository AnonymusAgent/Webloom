import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { LEAD_STATUSES } from "@/lib/site";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(500);
  return NextResponse.json({ leads: rows });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const status = typeof body?.status === "string" ? body.status : "";
  if (!id || !LEAD_STATUSES.some((s) => s.id === status)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  await db.update(leads).set({ status }).where(eq(leads.id, id));
  return NextResponse.json({ ok: true });
}
