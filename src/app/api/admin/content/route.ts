import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { faqs, posts, testimonials } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

const TABLES = { posts, testimonials, faqs } as const;
type Resource = keyof typeof TABLES;

function invalidate(resource: Resource) {
  revalidateTag(resource, { expire: 0 });
}

function resource(req: Request): Resource | null {
  const r = new URL(req.url).searchParams.get("resource");
  return r && r in TABLES ? (r as Resource) : null;
}

const clean = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const r = resource(req);
  if (!r) return NextResponse.json({ error: "Unknown resource" }, { status: 400 });

  if (r === "posts") {
    const rows = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(300);
    return NextResponse.json({ items: rows });
  }
  if (r === "testimonials") {
    const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt)).limit(300);
    return NextResponse.json({ items: rows });
  }
  const rows = await db.select().from(faqs).orderBy(faqs.sort, desc(faqs.createdAt)).limit(300);
  return NextResponse.json({ items: rows });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const r = resource(req);
  if (!r) return NextResponse.json({ error: "Unknown resource" }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  if (r === "posts") {
    const title = clean(body.title, 200);
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
    const slug = clean(body.slug, 120) ? slugify(clean(body.slug, 120)) : slugify(title);
    const [row] = await db
      .insert(posts)
      .values({
        slug,
        title,
        excerpt: clean(body.excerpt, 400),
        category: clean(body.category, 60) || "Technology",
        content: typeof body.content === "string" ? body.content.slice(0, 50000) : "",
        published: Boolean(body.published),
        featured: Boolean(body.featured),
      })
      .returning();
    invalidate("posts");
    return NextResponse.json({ item: row });
  }

  if (r === "testimonials") {
    const name = clean(body.name, 120);
    const quote = clean(body.quote, 1200);
    if (!name || !quote) return NextResponse.json({ error: "Name and quote required" }, { status: 400 });
    const [row] = await db
      .insert(testimonials)
      .values({
        name,
        quote,
        company: clean(body.company, 120) || null,
        position: clean(body.position, 120) || null,
        project: clean(body.project, 160) || null,
        published: body.published !== false,
      })
      .returning();
    invalidate("testimonials");
    return NextResponse.json({ item: row });
  }

  const question = clean(body.question, 300);
  const answer = clean(body.answer, 2000);
  if (!question || !answer) return NextResponse.json({ error: "Question and answer required" }, { status: 400 });
  const [row] = await db
    .insert(faqs)
    .values({
      question,
      answer,
      category: clean(body.category, 60) || "General",
      sort: typeof body.sort === "number" ? body.sort : 0,
      published: body.published !== false,
    })
    .returning();
  invalidate("faqs");
  return NextResponse.json({ item: row });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const r = resource(req);
  if (!r) return NextResponse.json({ error: "Unknown resource" }, { status: 400 });
  const body = await req.json().catch(() => null);
  const id = clean(body?.id, 64);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (r === "posts") {
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof body.title === "string") updates.title = clean(body.title, 200);
    if (typeof body.slug === "string") updates.slug = slugify(clean(body.slug, 120));
    if (typeof body.excerpt === "string") updates.excerpt = clean(body.excerpt, 400);
    if (typeof body.category === "string") updates.category = clean(body.category, 60);
    if (typeof body.content === "string") updates.content = body.content.slice(0, 50000);
    if (typeof body.published === "boolean") updates.published = body.published;
    if (typeof body.featured === "boolean") updates.featured = body.featured;
    await db.update(posts).set(updates).where(eq(posts.id, id));
    invalidate("posts");
    return NextResponse.json({ ok: true });
  }

  if (r === "testimonials") {
    const updates: Record<string, unknown> = {};
    for (const k of ["name", "company", "position", "project", "quote"] as const) {
      if (typeof body[k] === "string") updates[k] = clean(body[k], 1200) || null;
    }
    if (typeof body.published === "boolean") updates.published = body.published;
    await db.update(testimonials).set(updates).where(eq(testimonials.id, id));
    invalidate("testimonials");
    return NextResponse.json({ ok: true });
  }

  const updates: Record<string, unknown> = {};
  if (typeof body.question === "string") updates.question = clean(body.question, 300);
  if (typeof body.answer === "string") updates.answer = clean(body.answer, 2000);
  if (typeof body.category === "string") updates.category = clean(body.category, 60);
  if (typeof body.sort === "number") updates.sort = body.sort;
  if (typeof body.published === "boolean") updates.published = body.published;
  await db.update(faqs).set(updates).where(eq(faqs.id, id));
  invalidate("faqs");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const r = resource(req);
  if (!r) return NextResponse.json({ error: "Unknown resource" }, { status: 400 });
  const body = await req.json().catch(() => null);
  const id = clean(body?.id, 64);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.delete(TABLES[r]).where(eq(TABLES[r].id, id));
  invalidate(r);
  return NextResponse.json({ ok: true });
}
