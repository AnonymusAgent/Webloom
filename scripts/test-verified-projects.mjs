import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { withVerifiedProjects } from "../src/lib/verified-projects.ts";

const projects = withVerifiedProjects([]);
assert.equal(projects.length, 19, "The curated public baseline should be complete");
assert.equal(new Set(projects.map((project) => project.githubId)).size, projects.length);
assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
assert.ok(projects.every((project) => project.visibility === "public" && project.published));
assert.ok(projects.some((project) => project.name === "Type Arena" && project.featured));
assert.ok(projects.some((project) => project.name === "AR Manager" && project.featured));
for (const project of projects) {
  assert.match(project.githubUrl, /^https:\/\/github\.com\/AnonymusAgent\//);
  if (project.image) assert.ok(existsSync(`public${project.image}`), `${project.slug} needs its artwork`);
}

const arena = projects.find((project) => project.name === "Type Arena");
const edited = { ...arena, name: "Customized title", image: "/images/custom.jpg" };
const merged = withVerifiedProjects([edited]);
assert.equal(merged.length, projects.length, "An existing row must not be duplicated");
assert.equal(merged.find((project) => project.githubId === arena.githubId).name, "Customized title");
assert.equal(merged.find((project) => project.githubId === arena.githubId).image, "/images/custom.jpg");

const unpublished = withVerifiedProjects([{ ...arena, published: false }]);
assert.equal(unpublished.length, projects.length - 1, "An unpublished DB row must stay hidden");
assert.ok(!unpublished.some((project) => project.githubId === arena.githubId));

const renamed = withVerifiedProjects([{ ...arena, githubId: "replacement", slug: arena.slug }]);
assert.equal(renamed.length, projects.length, "A matching slug must not get a duplicate card");
console.log("19 curated public projects; fallbacks, edits, unpublished rows, slugs and images verified.");
