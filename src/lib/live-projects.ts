/** Verified public deployments for the matching GitHub repository entries. */
export const LIVE_PROJECTS = [
  { repo: "bloom-ar", name: "Bloom AR", href: "https://bloomar.vercel.app/" },
  { repo: "bloomrcm", name: "Bloom RCM", href: "https://bloomrcm.vercel.app/" },
  { repo: "type-arena", name: "Type Arena", href: "https://arena-skill.vercel.app/" },
] as const;

export function liveProjectUrl(repo: string): string | null {
  // The old database seed used AR-Manager before GitHub renamed the repository.
  const currentRepo = repo.toLowerCase() === "ar-manager" ? "bloom-ar" : repo.toLowerCase();
  return LIVE_PROJECTS.find((project) => project.repo === currentRepo)?.href ?? null;
}
