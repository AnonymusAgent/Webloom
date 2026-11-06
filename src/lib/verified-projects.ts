import type { GithubProject } from "@/db/schema";
import verifiedProjects from "./verified-projects.json" with { type: "json" };

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
 * A database row always wins (including unpublished rows and custom edits).
 * This does not recreate lost database records or expose private imports.
 */
export function withVerifiedProjects(rows: GithubProject[]): GithubProject[] {
  const knownIds = new Set(rows.map((row) => row.githubId));
  const knownSlugs = new Set(rows.map((row) => row.slug));
  const merged = [
    ...rows,
    ...baseline.filter((project) => !knownIds.has(project.githubId) && !knownSlugs.has(project.slug)),
  ];
  return merged
    .filter((project) => project.published)
    .sort((a, b) =>
      Number(b.featured) - Number(a.featured) ||
      (b.pushedAt ? new Date(b.pushedAt).getTime() : 0) -
      (a.pushedAt ? new Date(a.pushedAt).getTime() : 0)
    );
}
