import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { logs } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { getStats } from "@/lib/data";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const stats = await getStats();
  const activity = await db.select().from(logs).orderBy(desc(logs.createdAt)).limit(100);
  return NextResponse.json({ stats, logs: activity });
}
