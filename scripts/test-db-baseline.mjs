import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import baselineContent from "../src/lib/baseline-content.json" with { type: "json" };
import verifiedProjects from "../src/lib/verified-projects.json" with { type: "json" };

const journal = JSON.parse(readFileSync("drizzle/meta/_journal.json", "utf8"));
assert.equal(journal.entries.length, 1);
const migration = readFileSync(`drizzle/${journal.entries[0].tag}.sql`, "utf8");
for (const table of ["events", "faqs", "github_projects", "leads", "logs", "posts", "settings", "testimonials"]) {
  assert.ok(migration.includes(`CREATE TABLE "${table}"`), `${table} is absent from the checked-in schema migration`);
}
for (const column of ["github_id", "slug", "published", "featured", "homepage", "technologies", "visibility"]) {
  assert.ok(migration.includes(`"${column}"`), `${column} is absent from the schema migration`);
}
assert.equal(baselineContent.SETTINGS.length, 2);
assert.equal(baselineContent.POSTS.length, 2);
assert.equal(verifiedProjects.length, 20);
assert.ok(!verifiedProjects.some((project) => project.repo === "PlumberElectric"), "Retired work must not be seeded");
assert.equal(new Set(verifiedProjects.map((project) => project.githubId)).size, verifiedProjects.length);
assert.equal(new Set(verifiedProjects.map((project) => project.slug)).size, verifiedProjects.length);
assert.equal(typeof baselineContent.SETTINGS.find((setting) => setting.key === "contactEmail")?.value, "string");
assert.ok(Array.isArray(baselineContent.SETTINGS.find((setting) => setting.key === "socials")?.value));
console.log("Checked-in schema covers all 8 tables; insert-only baseline has 2 settings, 2 articles and 20 curated projects.");
