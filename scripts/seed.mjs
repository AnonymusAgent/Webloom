/**
 * Webloom database seed.
 *
 * Recreates the application's baseline content on top of the schema created
 * by `npx drizzle-kit push` or `npx drizzle-kit migrate`:
 *   - site settings (contact email, owned social links)
 *   - 2 published insight articles
 *   - 20 source-verified GitHub portfolio projects
 *
 * The script is idempotent: existing rows are never overwritten, so any
 * edits made in /admin are preserved when re-running it.
 *
 * Usage:
 *   DATABASE_URL=... node scripts/seed.mjs
 * (or configure .env first — dotenv loads it automatically)
 */
import "dotenv/config";
import { Client } from "pg";
// Shared with the public portfolio fallback; no database credentials in this file.
import PROJECTS from "../src/lib/verified-projects.json" with { type: "json" };
import baselineContent from "../src/lib/baseline-content.json" with { type: "json" };

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required. Copy .env.example to .env and configure it.");
  process.exit(1);
}

const { SETTINGS, POSTS } = baselineContent;

const client = new Client({ connectionString: databaseUrl, connectionTimeoutMillis: 8_000 });

function safeError(error) {
  // PG error messages may include SQL or connection information; print codes only.
  return error instanceof Error && "code" in error ? String(error.code) : "connection or query failed";
}

async function main() {
  try {
    await client.connect();
    const { rows: [identity] } = await client.query(`
      SELECT current_database() AS database,
        to_regclass('public.settings') IS NOT NULL AS settings,
        to_regclass('public.posts') IS NOT NULL AS posts,
        to_regclass('public.github_projects') IS NOT NULL AS projects
    `);
    const expectedDatabase = process.env.WEBLOOM_EXPECTED_DATABASE || "neondb";
    if (identity.database !== expectedDatabase || !identity.settings || !identity.posts || !identity.projects) {
      throw new Error("Unexpected database or missing Webloom tables. No changes made.");
    }
    await client.query("BEGIN");
    await client.query("SET LOCAL lock_timeout = '5s'");
    await client.query("SET LOCAL statement_timeout = '60s'");

    for (const s of SETTINGS) {
      await client.query(
        `INSERT INTO public.settings (key, value) VALUES ($1, $2::jsonb)
         ON CONFLICT (key) DO NOTHING`,
        [s.key, JSON.stringify(s.value)]
      );
    }

    for (const p of POSTS) {
      await client.query(
        `INSERT INTO public.posts (slug, title, excerpt, category, content, published, featured)
         VALUES ($1,$2,$3,$4,$5,true,$6)
         ON CONFLICT (slug) DO NOTHING`,
        [p.slug, p.title, p.excerpt, p.category, p.content, p.featured]
      );
    }

    for (const p of PROJECTS) {
      await client.query(
        `INSERT INTO public.github_projects
          (github_id, owner, repo, slug, name, category, summary, image, github_url,
           language, topics, technologies, languages, visibility, stars, forks,
           archived, published, featured, pushed_at)
         VALUES ($1,'AnonymusAgent',$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12::jsonb,
                 'public',$13,0,false,true,$14,$15)
         ON CONFLICT DO NOTHING`,
        [
          p.githubId, p.repo, p.slug, p.name, p.category, p.summary, p.image,
          p.githubUrl || `https://github.com/AnonymusAgent/${p.repo}`, p.language,
          JSON.stringify(p.topics), JSON.stringify(p.tech),
          JSON.stringify(p.language ? { [p.language]: 1 } : {}),
          p.stars, p.featured, p.pushedAt,
        ]
      );
    }

    const counts = await client.query(
      `SELECT (SELECT count(*) FROM public.github_projects)::int AS projects,
              (SELECT count(*) FROM public.posts)::int AS posts,
              (SELECT count(*) FROM public.settings)::int AS settings`
    );
    const curated = await client.query(
      `SELECT count(*)::int AS present FROM public.github_projects WHERE github_id = ANY($1::text[])`,
      [PROJECTS.map((project) => project.githubId)]
    );
    await client.query("COMMIT");
    console.log("Seed complete:", { ...counts.rows[0], curatedPresent: curated.rows[0].present, curatedCount: PROJECTS.length });
    if (curated.rows[0].present !== PROJECTS.length) {
      console.warn("Some curated projects could not be inserted (a conflicting slug may exist). Review existing rows.");
    }
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    await client.end().catch(() => {});
  }
}

main().catch((error) => {
  const expected = "Unexpected database or missing Webloom tables. No changes made.";
  console.error(error instanceof Error && error.message === expected ? expected : safeError(error));
  process.exitCode = 1;
});
