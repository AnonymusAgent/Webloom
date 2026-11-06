import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { LIVE_PROJECTS, liveProjectUrl } from "../src/lib/live-projects.ts";
import { VERIFIED_PROJECT_COVERS, withVerifiedProjects } from "../src/lib/verified-projects.ts";

const projects = withVerifiedProjects([]);
assert.equal(projects.length, 21, "The curated public baseline should be complete");
assert.equal(new Set(projects.map((project) => project.githubId)).size, projects.length);
assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
assert.ok(projects.every((project) => project.visibility === "public" && project.published));
const featuredIds = ["1326109868", "1441273336", "1406597009", "1445700910"];
assert.deepEqual(projects.slice(0, 4).map((project) => project.githubId), featuredIds,
  "Bloom AR, Bloom RCM, Type Arena and VELTRIO should lead the Work page and homepage preview");
assert.deepEqual(projects.slice(0, 4).map((project) => project.name), ["Bloom AR", "Bloom RCM", "Type Arena", "VELTRIO"]);
assert.equal(projects[0].githubUrl, "https://github.com/AnonymusAgent/Bloom-AR");
assert.equal(projects[1].githubUrl, "https://github.com/AnonymusAgent/bloomrcm");
assert.equal(projects[3].githubUrl, "https://github.com/AnonymusAgent/VELTRIO");
assert.deepEqual(LIVE_PROJECTS.map(({ name }) => name), ["Bloom AR", "Bloom RCM", "Type Arena", "VELTRIO"]);
assert.equal(liveProjectUrl("AR-Manager"), "https://bloomar.vercel.app/");
assert.equal(liveProjectUrl("Bloom-AR"), "https://bloomar.vercel.app/");
assert.equal(liveProjectUrl("bloomrcm"), "https://bloomrcm.vercel.app/");
assert.equal(liveProjectUrl("type-arena"), "https://arena-skill.vercel.app/");
assert.equal(liveProjectUrl("VELTRIO"), "https://veltrio-new.vercel.app/");
for (const project of projects) {
  assert.match(project.githubUrl, /^https:\/\/github\.com\/AnonymusAgent\//);
  assert.ok(project.image && existsSync(`public${project.image}`), `${project.slug} needs its artwork`);
  assert.equal(VERIFIED_PROJECT_COVERS[project.githubId], project.image, `${project.slug} should cover older DB imports`);
}

const arena = projects.find((project) => project.name === "Type Arena");
const edited = { ...arena, name: "Customized title", image: "/images/custom.jpg" };
const merged = withVerifiedProjects([edited]);
assert.equal(merged.length, projects.length, "An existing row must not be duplicated");
assert.equal(merged.find((project) => project.githubId === arena.githubId).name, "Customized title");
assert.equal(merged.find((project) => project.githubId === arena.githubId).image, "/images/custom.jpg");

const oldRows = featuredIds.map((id) => ({
  ...projects.find((project) => project.githubId === id), featured: false,
}));
assert.deepEqual(withVerifiedProjects(oldRows).slice(0, 4).map((project) => project.githubId), featuredIds,
  "Older DB featured flags must not displace the requested showcase order");

const unpublished = withVerifiedProjects([{ ...arena, published: false }]);
assert.equal(unpublished.length, projects.length - 1, "An unpublished DB row must stay hidden");
assert.ok(!unpublished.some((project) => project.githubId === arena.githubId));

const renamed = withVerifiedProjects([{ ...arena, githubId: "replacement", slug: arena.slug }]);
assert.equal(renamed.length, projects.length, "A matching slug must not get a duplicate card");
console.log("21 curated public projects; order, live links, fallbacks, edits, unpublished rows, slugs and images verified.");
