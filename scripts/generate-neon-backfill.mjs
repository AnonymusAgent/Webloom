/* Deterministically render an insert-only SQL script for Neon SQL Editor. No DB access. */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import baseline from "../src/lib/baseline-content.json" with { type: "json" };
import projects from "../src/lib/verified-projects.json" with { type: "json" };
import { liveProjectUrl } from "../src/lib/live-projects.ts";

const snapshot = JSON.parse(readFileSync(new URL("../drizzle/meta/0000_snapshot.json", import.meta.url)));
const text = (value) => value == null ? "NULL" : `'${String(value).replaceAll("'", "''")}'`;
const jsonb = (value) => `${text(JSON.stringify(value))}::jsonb`;
const bool = (value) => value ? "true" : "false";

export function renderNeonBackfill() {
  const columns = Object.entries(snapshot.tables).flatMap(([qualifiedName, table]) => {
    const name = qualifiedName.replace(/^public\./, "");
    return Object.keys(table.columns).map((column) => `    (${text(name)}, ${text(column)})`);
  });
  const settingRows = baseline.SETTINGS.map((item) => `  (${text(item.key)}, ${jsonb(item.value)})`);
  const postRows = baseline.POSTS.map((item) => `  (${[
    text(item.slug), text(item.title), text(item.excerpt), text(item.category),
    text(item.content), "true", bool(item.featured),
  ].join(", ")})`);
  const projectRows = projects.map((project) => `  (${[
    text(project.githubId), text("AnonymusAgent"), text(project.repo), text(project.slug),
    text(project.name), text(project.category), text(project.summary), text(project.image),
    text(project.githubUrl || `https://github.com/AnonymusAgent/${project.repo}`),
    text(liveProjectUrl(project.repo)), text(project.language), jsonb(project.topics),
    jsonb(project.tech), jsonb(project.language ? { [project.language]: 1 } : {}),
    text("public"), project.stars, 0, "false", "true", bool(project.featured),
    project.pushedAt ? `${text(project.pushedAt)}::timestamptz` : "NULL",
  ].join(", ")})`);
  const projectIds = projects.map((project) => text(project.githubId)).join(", ");
  const postSlugs = baseline.POSTS.map((item) => text(item.slug)).join(", ");
  const settingKeys = baseline.SETTINGS.map((item) => text(item.key)).join(", ");

  return `-- WEBLOOM / NEON: insert missing baseline rows into the existing neondb database.
-- Paste/run this entire script in Neon SQL Editor as one execution. No password needed here.
-- Insert-only: preserves existing rows, unpublished choices and admin edits.
-- Does not synthesize leads, events, logs, FAQs or testimonials.
-- Do NOT run the initial Drizzle migration on a populated database.
-- If ANY statement errors, run ROLLBACK in the same SQL session before retrying.
-- If the schema guard fails, stop: review missing tables/columns separately.
-- Generated from src/lib/verified-projects.json, baseline-content.json and the
-- tracked Drizzle snapshot. To refresh: npm run db:generate-sql

BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

DO $webloom$
BEGIN
  IF current_database() <> 'neondb' THEN
    RAISE EXCEPTION 'Expected neondb. No changes made.';
  END IF;
  IF EXISTS (
    SELECT 1 FROM (VALUES
${columns.join(",\n")}
    ) AS required(table_name, column_name)
    LEFT JOIN information_schema.columns AS actual
      ON actual.table_schema = 'public'
     AND actual.table_name = required.table_name
     AND actual.column_name = required.column_name
    WHERE actual.column_name IS NULL
  ) THEN
    RAISE EXCEPTION 'Webloom schema missing a required table or column. No changes made.';
  END IF;
END
$webloom$;

INSERT INTO public.settings (key, value)
VALUES
${settingRows.join(",\n")}
ON CONFLICT DO NOTHING;

INSERT INTO public.posts (slug, title, excerpt, category, content, published, featured)
VALUES
${postRows.join(",\n")}
ON CONFLICT DO NOTHING;

INSERT INTO public.github_projects
  (github_id, owner, repo, slug, name, category, summary, image, github_url,
   homepage, language, topics, technologies, languages, visibility, stars, forks,
   archived, published, featured, pushed_at)
VALUES
${projectRows.join(",\n")}
ON CONFLICT DO NOTHING;

COMMIT;

-- Confirm committed row counts. Conflicting slugs can leave curated_present below 20;
-- do not overwrite those rows automatically; review them in Admin first.
SELECT
  (SELECT count(*) FROM public.github_projects) AS total_projects,
  (SELECT count(*) FROM public.github_projects WHERE github_id IN (${projectIds})) AS curated_present_of_${projects.length},
  (SELECT count(*) FROM public.posts WHERE slug IN (${postSlugs})) AS baseline_posts_present_of_${baseline.POSTS.length},
  (SELECT count(*) FROM public.settings WHERE key IN (${settingKeys})) AS baseline_settings_present_of_${baseline.SETTINGS.length};
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const output = new URL("./neon-backfill.sql", import.meta.url);
  writeFileSync(output, renderNeonBackfill());
  console.log("Wrote scripts/neon-backfill.sql (no database connection or write). ");
}
