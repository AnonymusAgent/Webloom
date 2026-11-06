import type { GithubProject } from "@/db/schema";
import verifiedProjects from "./verified-projects.json" with { type: "json" };

// Covers are shared by the static baseline and older admin-imported rows that
// have no image yet. An explicitly configured image in the DB always wins.
export const VERIFIED_PROJECT_COVERS: Record<string, string> = Object.fromEntries(
  verifiedProjects.filter((project) => project.image).map((project) => [project.githubId, project.image!])
);

// A public, curated safety net for the portfolio; these are the same records
// used by the insert-only database seed. No private/discovered repositories are
// published here. The synthetic IDs exist only in rendered output, never in DB.
const baseline: GithubProject[] = verifiedProjects.map((project) => ({
  id: `baseline-${project.githubId}`,
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
  homepage: null,
  language: project.language,
  topics: project.topics,
  technologies: project.tech,
  languages: {},
  readmeExcerpt: null,
  visibility: "public",
  stars: project.stars,
  forks: 0,
  archived: false,
  published: true,
  featured: project.featured,
  pushedAt: project.pushedAt ? new Date(project.pushedAt) : null,
  fetchedAt: new Date(0),
  createdAt: new Date(0),
  updatedAt: new Date(0),
}));

/**
 * Show missing curated public work even if the database is empty/unreachable.
 * A database row wins (including unpublished rows and custom edits), except
 * the explicitly retired PlumberElectric card is hidden from public output.
 * This does not recreate lost database records or expose private imports.
 */
const PINNED_FEATURED = new Map([
  ["1326109868", 0], // Bloom AR
  ["1441273336", 1], // Bloom RCM — second in Work and the homepage preview
  ["1406597009", 2], // Type Arena
  ["1445700910", 3], // VELTRIO — fourth in Work and the homepage preview
]);

// Preserve existing DB rows/admin edits: this is a public presentation change,
// not a database deletion or an overwrite of the admin's featured flags.
const HIDDEN_PUBLIC_IDS = new Set(["1241902146"]); // PlumberElectric
const FEATURED_PUBLIC_IDS = new Set([...PINNED_FEATURED.keys(), "1241901859"]); // ProFix

export function withVerifiedProjects(rows: GithubProject[]): GithubProject[] {
  const knownIds = new Set(rows.map((row) => row.githubId));
  const knownSlugs = new Set(rows.filter((row) => !HIDDEN_PUBLIC_IDS.has(row.githubId)).map((row) => row.slug));
  const merged = [
    ...rows,
    ...baseline.filter((project) => !knownIds.has(project.githubId) && !knownSlugs.has(project.slug)),
  ];
  return merged
    // Respect explicit unpublishing and hide retired PlumberElectric imports.
    // Promote ProFix while keeping the first four showcase slots pinned.
    .filter((project) => project.published && !HIDDEN_PUBLIC_IDS.has(project.githubId))
    .map((project) => FEATURED_PUBLIC_IDS.has(project.githubId) ? { ...project, featured: true } : project)
    .sort((a, b) =>
      Number(b.featured) - Number(a.featured) ||
      (PINNED_FEATURED.get(a.githubId) ?? 99) - (PINNED_FEATURED.get(b.githubId) ?? 99) ||
      (b.pushedAt ? new Date(b.pushedAt).getTime() : 0) -
      (a.pushedAt ? new Date(a.pushedAt).getTime() : 0)
    );
}
