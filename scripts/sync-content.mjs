/**
 * Seed missing baseline content, then bring three previously seeded portfolio
 * entries up to date. Existing posts/settings and custom project images are
 * preserved. Run from an environment that can reach Neon with DATABASE_URL set.
 * No credentials or database contents are written to disk.
 */
import "dotenv/config";
import { spawnSync } from "node:child_process";
import { Client } from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL must be set in the environment.");
  process.exit(1);
}

function safeError(error) {
  // PostgreSQL errors can contain query details; do not print connection strings.
  return error instanceof Error && "code" in error ? String(error.code) : "connection or query failed";
}

async function preflight() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 8_000 });
  try {
    await client.connect();
    const { rows: [identity] } = await client.query(`
      SELECT current_database() AS database,
        to_regclass('public.settings') IS NOT NULL AS settings,
        to_regclass('public.posts') IS NOT NULL AS posts,
        to_regclass('public.github_projects') IS NOT NULL AS projects
    `);
    if (identity.database !== "neondb" || !identity.settings || !identity.posts || !identity.projects) {
      throw new Error("Unexpected database or missing Webloom tables. No changes made.");
    }
    console.log("Preflight passed: expected Webloom database and tables found.");
  } finally {
    await client.end().catch(() => {});
  }
}

async function syncPortfolio() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 8_000 });
  try {
    await client.connect();
    await client.query("BEGIN");
    const arena = await client.query(`
      UPDATE public.github_projects SET
        image = CASE WHEN image IS NULL OR image = '' THEN $2 ELSE image END,
        homepage = $3, updated_at = now()
      WHERE github_id = $1 AND lower(owner) = 'anonymusagent'
      RETURNING github_id
    `, ["1406597009", "/images/projects/type-arena.jpg", "https://type-arena-silk.vercel.app/"]);

    const manager = await client.query(`
      UPDATE public.github_projects SET
        image = CASE WHEN image IS NULL OR image = '' OR image = '/images/projects/ar-manager.jpg' THEN $2 ELSE image END,
        homepage = $3,
        category = CASE WHEN category = 'Desktop Application' THEN 'Medical Billing AR Platform' ELSE category END,
        summary = CASE WHEN summary LIKE '%desktop resource/asset management%'
          THEN 'A Next.js accounts-receivable workspace for medical billing, with claims review, denials, payments, authorizations, reporting and role-based workflows.'
          ELSE summary END,
        language = CASE WHEN language = 'C#' THEN 'TypeScript' ELSE language END,
        technologies = CASE WHEN technologies @> '["C#"]'::jsonb
          THEN '["Next.js","React","TypeScript","PostgreSQL","Drizzle ORM"]'::jsonb ELSE technologies END,
        updated_at = now()
      WHERE github_id = $1 AND lower(owner) = 'anonymusagent'
      RETURNING github_id
    `, ["1326109868", "/images/projects/ar-manager.svg", "https://ar-manager-ten.vercel.app/login"]);

    const restaurant = await client.query(`
      UPDATE public.github_projects SET
        image = CASE WHEN image IS NULL OR image = '' THEN $2 ELSE image END,
        updated_at = now()
      WHERE github_id = $1 AND lower(owner) = 'anonymusagent'
      RETURNING github_id
    `, ["994242633", "/images/projects/la-maison-restaurant.jpg"]);

    if ([arena, manager, restaurant].some((result) => result.rowCount !== 1)) {
      throw new Error("Expected one matching row per portfolio project; portfolio updates rolled back.");
    }

    const { rows: [counts] } = await client.query(`
      SELECT (SELECT count(*)::int FROM public.settings) AS settings,
        (SELECT count(*)::int FROM public.posts) AS posts,
        (SELECT count(*)::int FROM public.github_projects) AS projects
    `);
    await client.query("COMMIT");
    console.log("Synced Type Arena, AR Manager and La Maison Restaurant. Row counts:", counts);
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    await client.end().catch(() => {});
  }
}

try {
  await preflight();
  const seed = spawnSync(process.execPath, ["scripts/seed.mjs"], {
    env: process.env,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 90_000,
  });
  // The original seed reports raw database errors. Only relay its success
  // count; never relay error output that might contain a connection string.
  if (seed.error || seed.status !== 0) throw new Error("Baseline seed failed; portfolio updates were not attempted.");
  if (seed.stdout?.includes("Seed complete:")) console.log(seed.stdout.trim());
  await syncPortfolio();
} catch (error) {
  const safeMessages = new Set([
    "Unexpected database or missing Webloom tables. No changes made.",
    "Baseline seed failed; portfolio updates were not attempted.",
    "Expected one matching row per portfolio project; portfolio updates rolled back.",
  ]);
  console.error(error instanceof Error && safeMessages.has(error.message) ? error.message : safeError(error));
  process.exitCode = 1;
}
