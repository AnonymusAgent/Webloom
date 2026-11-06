/* Read-only database preflight. Run only in a trusted environment with DATABASE_URL. */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { Client } from "pg";
import baseline from "../src/lib/baseline-content.json" with { type: "json" };
import projects from "../src/lib/verified-projects.json" with { type: "json" };

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required in the environment.");
  process.exit(1);
}

const snapshot = JSON.parse(readFileSync(new URL("../drizzle/meta/0000_snapshot.json", import.meta.url)));
const tables = Object.fromEntries(
  Object.entries(snapshot.tables).map(([name, table]) => [name.replace(/^public\./, ""), Object.keys(table.columns)])
);
const client = new Client({ connectionString: url, connectionTimeoutMillis: 8_000 });

async function main() {
  try {
    await client.connect();
    const result = await client.query(
      `SELECT table_name, column_name FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = ANY($1::text[])`,
      [Object.keys(tables)]
    );
    const columns = new Set(result.rows.map((row) => `${row.table_name}.${row.column_name}`));
    const missing = Object.entries(tables).flatMap(([table, expected]) =>
      expected.filter((column) => !columns.has(`${table}.${column}`)).map((column) => `${table}.${column}`)
    );
    if (missing.length > 0) {
      console.error(`Schema incomplete: ${missing.join(", ")}. No changes made.`);
      process.exitCode = 1;
      return;
    }
    const counts = {};
    for (const table of Object.keys(tables)) {
      // Names come only from the checked-in snapshot, never from user input.
      const { rows: [row] } = await client.query(`SELECT count(*)::int AS count FROM public."${table}"`);
      counts[table] = row.count;
    }
    const { rows: [baselineCounts] } = await client.query(`
      SELECT
        (SELECT count(*)::int FROM public.github_projects WHERE github_id = ANY($1::text[])) AS curated_projects,
        (SELECT count(*)::int FROM public.posts WHERE slug = ANY($2::text[])) AS baseline_posts,
        (SELECT count(*)::int FROM public.settings WHERE key = ANY($3::text[])) AS baseline_settings
    `, [projects.map((p) => p.githubId), baseline.POSTS.map((p) => p.slug), baseline.SETTINGS.map((s) => s.key)]);
    console.log("Schema: all 8 baseline tables and their columns are present.");
    console.log("Row counts:", counts);
    console.log("Baseline present:", {
      projects: `${baselineCounts.curated_projects}/${projects.length}`,
      posts: `${baselineCounts.baseline_posts}/${baseline.POSTS.length}`,
      settings: `${baselineCounts.baseline_settings}/${baseline.SETTINGS.length}`,
    });
  } catch (error) {
    // Never print SQL driver messages: they may expose connection details.
    console.error(error instanceof Error && "code" in error ? String(error.code) : "Database verification failed.");
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

await main();
