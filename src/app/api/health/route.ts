import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({
      status: "ok",
      db: "up",
      time: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      { status: "error", db: "down", time: new Date().toISOString() },
      { status: 503 }
    );
  }
}
