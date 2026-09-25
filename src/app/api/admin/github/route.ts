import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { githubProjects } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import {
  discoverAuthenticatedRepositories,
  inspectRepository,
  parseGitHubRepositoryUrl,
} from "@/lib/github";
import { log } from "@/lib/data";

export const runtime = "nodejs";

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projects = await db
    .select()
    .from(githubProjects)
    .orderBy(desc(githubProjects.featured), desc(githubProjects.updatedAt));
  return NextResponse.json({
    projects,
    tokenConfigured: Boolean(process.env.GITHUB_TOKEN),
  });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (body.action === "discover") {
      const repositories = await discoverAuthenticatedRepositories();
      return NextResponse.json({ repositories });
    }

    const url = clean(body.url, 500);
    if (!url) {
      return NextResponse.json(
        { error: "A specific GitHub repository URL is required." },
        { status: 400 }
      );
    }

    const inspected = await inspectRepository(parseGitHubRepositoryUrl(url));
    const [project] = await db
      .insert(githubProjects)
      .values({
        githubId: inspected.githubId,
        owner: inspected.owner,
        repo: inspected.repo,
        slug: inspected.slug,
        name: inspected.name,
        category: "Open-source project",
        summary: inspected.summary,
        githubUrl: inspected.githubUrl,
        homepage: inspected.homepage,
        language: inspected.language,
        topics: inspected.topics as never,
        technologies: inspected.technologies as never,
        languages: inspected.languages as never,
        readmeExcerpt: inspected.readmeExcerpt,
        visibility: inspected.visibility,
        stars: inspected.stars,
        forks: inspected.forks,
        archived: inspected.archived,
        pushedAt: inspected.pushedAt,
        fetchedAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: githubProjects.githubId,
        set: {
          owner: inspected.owner,
          repo: inspected.repo,
          slug: inspected.slug,
          githubUrl: inspected.githubUrl,
          language: inspected.language,
          topics: inspected.topics as never,
          technologies: inspected.technologies as never,
          languages: inspected.languages as never,
          readmeExcerpt: inspected.readmeExcerpt,
          visibility: inspected.visibility,
          stars: inspected.stars,
          forks: inspected.forks,
          archived: inspected.archived,
          pushedAt: inspected.pushedAt,
          fetchedAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();

    await log("info", "github_project_imported", {
      repository: `${inspected.owner}/${inspected.repo}`,
      visibility: inspected.visibility,
    });
    revalidateTag("github-projects", { expire: 0 });
    return NextResponse.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "GitHub import failed.";
    await log("error", "github_project_import_error", { message });
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const id = clean(body?.id, 64);
  if (!id) return NextResponse.json({ error: "Missing project id." }, { status: 400 });

  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof body.name === "string") {
    const name = clean(body.name, 160);
    if (!name) return NextResponse.json({ error: "Project name cannot be empty." }, { status: 400 });
    update.name = name;
  }
  if (typeof body.category === "string") {
    update.category = clean(body.category, 100) || "Software Project";
  }
  if (typeof body.summary === "string") update.summary = clean(body.summary, 1200);
  if (typeof body.homepage === "string") {
    const homepage = clean(body.homepage, 500);
    if (homepage && !/^https?:\/\//i.test(homepage)) {
      return NextResponse.json({ error: "Homepage must be an http(s) URL." }, { status: 400 });
    }
    update.homepage = homepage || null;
  }
  if (typeof body.published === "boolean") update.published = body.published;
  if (typeof body.featured === "boolean") update.featured = body.featured;

  const [project] = await db
    .update(githubProjects)
    .set(update)
    .where(eq(githubProjects.id, id))
    .returning();
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });
  revalidateTag("github-projects", { expire: 0 });
  return NextResponse.json({ project });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const id = clean(body?.id, 64);
  if (!id) return NextResponse.json({ error: "Missing project id." }, { status: 400 });
  await db.delete(githubProjects).where(eq(githubProjects.id, id));
  revalidateTag("github-projects", { expire: 0 });
  return NextResponse.json({ ok: true });
}
