/** Verified public deployments for the matching GitHub repository entries. */
export const LIVE_PROJECTS = [
  { repo: "type-arena", name: "Type Arena", href: "https://type-arena-silk.vercel.app/" },
  { repo: "ar-manager", name: "AR Manager", href: "https://ar-manager-ten.vercel.app/login" },
] as const;

export function liveProjectUrl(repo: string): string | null {
  return LIVE_PROJECTS.find((project) => project.repo === repo.toLowerCase())?.href ?? null;
}
