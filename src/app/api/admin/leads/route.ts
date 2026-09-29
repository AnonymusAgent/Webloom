import { NextResponse } from "next/server";
import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { log } from "@/lib/data";
import { sendLeadDecisionEmail } from "@/lib/lead-email";
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
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ||
      !LEAD_STATUSES.some((s) => s.id === status)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const [updatedLead] = await db
      .update(leads)
      .set({ status })
      .where(and(eq(leads.id, id), ne(leads.status, status)))
      .returning();

    if (!updatedLead) {
      const [existingLead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
      if (!existingLead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      return NextResponse.json({
        ok: true,
        statusUpdated: false,
        notificationSent: false,
        notificationStatus: "unchanged",
        message: "Status is unchanged; no duplicate notification was sent.",
      });
    }

    if (status !== "accepted" && status !== "rejected") {
      return NextResponse.json({
        ok: true,
        statusUpdated: true,
        notificationSent: false,
        notificationStatus: "not_required",
        message: "Lead status updated.",
      });
    }

    const result = await sendLeadDecisionEmail(updatedLead, status);
    if (result.sent) {
      await log("info", "lead_decision_email_sent", { leadId: id, status });
      return NextResponse.json({
        ok: true,
        statusUpdated: true,
        notificationSent: true,
        notificationStatus: "sent",
        message: "Status updated and customer notification sent.",
      });
    }

    const message = result.reason === "not_configured"
      ? "Status updated, but email is not configured. Add BREVO_API_KEY and EMAIL_FROM."
      : result.reason === "invalid_email"
        ? "Status updated, but the customer email address is missing or invalid."
        : "Status updated, but the customer email could not be sent. Check the Activity log.";
    await log(result.reason === "invalid_email" ? "warn" : "error", "lead_decision_email_failed", {
      leadId: id,
      status,
      reason: result.reason,
    });
    return NextResponse.json({
      ok: true,
      statusUpdated: true,
      notificationSent: false,
      notificationStatus: result.reason === "invalid_email" ? "skipped" : "failed",
      message,
    });
  } catch (error) {
    await log("error", "lead_status_update_failed", {
      leadId: id,
      errorType: error instanceof Error ? error.name : "unknown",
    });
    return NextResponse.json({ error: "Could not update lead status." }, { status: 500 });
  }
}
