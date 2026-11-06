import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { githubProjects, posts, settings } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import {
  discoverAuthenticatedRepositories,
  inspectRepository,
  parseGitHubRepositoryUrl,
} from "@/lib/github";
import { log } from "@/lib/data";
import { liveProjectUrl } from "@/lib/live-projects";
import verifiedProjects from "@/lib/verified-projects.json" with { type: "json" };
import baselineContent from "@/lib/baseline-content.json" with { type: "json" };

export const runtime = "nodejs";

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const projects = await db
      .select()
      .from(githubProjects)
      .orderBy(desc(githubProjects.featured), desc(githubProjects.updatedAt));
    const [storedSettings, storedPosts] = await Promise.all([
      db.select({ key: settings.key }).from(settings),
      db.select({ slug: posts.slug }).from(posts),
    ]);
    const curatedIds = new Set(verifiedProjects.map((project) => project.githubId));
    const settingKeys = new Set(storedSettings.map((row) => row.key));
    const postSlugs = new Set(storedPosts.map((row) => row.slug));
    return NextResponse.json({
      projects,
      curatedCount: curatedIds.size,
      curatedPresent: projects.filter((project) => curatedIds.has(project.githubId)).length,
      settingsPresent: baselineContent.SETTINGS.filter((item) => settingKeys.has(item.key)).length,
      postsPresent: baselineContent.POSTS.filter((item) => postSlugs.has(item.slug)).length,
      tokenConfigured: Boolean(process.env.GITHUB_TOKEN),
    });
  } catch {
    return NextResponse.json({ error: "Cannot inspect baseline rows. Verify the database schema and permissions in a trusted environment." }, { status: 503 });
  }
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

    if (body.action === "seed-curated") {
      // Explicit admin-only repair for missing baseline settings, posts and
      // projects. Never run on public page loads, overwrite edits, or insert
      // retired projects. Leads, events, logs, FAQs and testimonials are not
      // synthetic baseline data and must not be fabricated.
      // Require a same-origin browser request in addition to the admin cookie.
      const requestOrigin = req.headers.get("origin");
      const requestHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
      const requestProtocol = req.headers.get("x-forwarded-proto") || new URL(req.url).protocol.slice(0, -1);
      let sameOrigin = false;
      try {
        const parsed = new URL(requestOrigin || "");
        sameOrigin = parsed.host === requestHost && parsed.protocol === `${requestProtocol}:`;
      } catch {
        // Missing or malformed Origin is not a browser-initiated same-origin request.
      }
      if (!sameOrigin) {
        return NextResponse.json({ error: "Same-origin request required." }, { status: 403 });
      }
      let result;
      try {
        result = await db.transaction(async (tx) => {
          let settingsInserted = 0;
          let postsInserted = 0;
          let projectsInserted = 0;
          for (const item of baselineContent.SETTINGS) {
            const rows = await tx.insert(settings).values({
              key: item.key,
              value: item.value,
            }).onConflictDoNothing().returning({ key: settings.key });
            settingsInserted += rows.length;
          }
          for (const item of baselineContent.POSTS) {
            const rows = await tx.insert(posts).values({
              slug: item.slug,
              title: item.title,
              excerpt: item.excerpt,
              category: item.category,
              content: item.content,
              published: true,
              featured: item.featured,
            }).onConflictDoNothing().returning({ slug: posts.slug });
            postsInserted += rows.length;
          }
          for (const project of verifiedProjects) {
            const rows = await tx.insert(githubProjects).values({
              githubId: project.githubId,
              owner: "AnonymusAgent",
              repo: project.repo,
              slug: project.slug,
              name: project.name,
              category: project.category,
              summary: project.summary,
              image: project.image,
              githubUrl: "githubUrl" in project && typeof project.githubUrl === "string"
                ? project.githubUrl : `https://github.com/AnonymusAgent/${project.repo}`,
              homepage: liveProjectUrl(project.repo),
              language: project.language,
              topics: project.topics,
              technologies: project.tech,
              languages: project.language ? { [project.language]: 1 } : {},
              visibility: "public",
              stars: project.stars,
              forks: 0,
              archived: false,
              published: true,
              featured: project.featured,
              pushedAt: project.pushedAt ? new Date(project.pushedAt) : null,
            }).onConflictDoNothing().returning({ githubId: githubProjects.githubId });
            projectsInserted += rows.length;
          }
          const [existing, currentSettings, currentPosts] = await Promise.all([
            tx.select({ githubId: githubProjects.githubId }).from(githubProjects),
            tx.select({ key: settings.key }).from(settings),
            tx.select({ slug: posts.slug }).from(posts),
          ]);
          const present = new Set(existing.map((row) => row.githubId));
          const settingKeys = new Set(currentSettings.map((row) => row.key));
          const postSlugs = new Set(currentPosts.map((row) => row.slug));
          return {
            settingsInserted,
            postsInserted,
            projectsInserted,
            total: existing.length,
            curatedPresent: verifiedProjects.filter((project) => present.has(project.githubId)).length,
            curatedCount: verifiedProjects.length,
            settingsPresent: baselineContent.SETTINGS.filter((item) => settingKeys.has(item.key)).length,
            postsPresent: baselineContent.POSTS.filter((item) => postSlugs.has(item.slug)).length,
          };
        });
      } catch {
        // Database errors can contain connection details. Do not echo them to
        // the browser or logs. A mismatched schema must be reviewed separately.
        return NextResponse.json(
          { error: "Baseline backfill failed and was rolled back. Verify database tables, columns and permissions in a trusted environment." },
          { status: 503 }
        );
      }
      revalidateTag("github-projects", { expire: 0 });
      revalidateTag("posts", { expire: 0 });
      revalidateTag("site-settings", { expire: 0 });
      await log("info", "baseline_content_seeded", result);
      return NextResponse.json(result);
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
