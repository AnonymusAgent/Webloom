import "server-only";

const API = "https://api.github.com";
const API_VERSION = "2022-11-28";

export type GitHubRepoRef = { owner: string; repo: string };

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  visibility?: string;
  private: boolean;
  archived: boolean;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
  pushed_at: string | null;
  fork: boolean;
};

type GitHubContent = {
  content?: string;
  encoding?: string;
  download_url?: string | null;
};

type GitHubTree = {
  tree?: { path: string; type: "blob" | "tree"; size?: number }[];
  truncated?: boolean;
};

export type InspectedRepository = {
  githubId: string;
  owner: string;
  repo: string;
  slug: string;
  name: string;
  summary: string;
  githubUrl: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  technologies: string[];
  languages: Record<string, number>;
  readmeExcerpt: string | null;
  visibility: string;
  stars: number;
  forks: number;
  archived: boolean;
  pushedAt: Date | null;
};

function headers() {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": API_VERSION,
    "User-Agent": "Webloom-Portfolio-Importer",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function githubJson<T>(path: string, optional = false): Promise<T | null> {
  const response = await fetch(`${API}${path}`, {
    headers: headers(),
    cache: "no-store",
  });

  if (optional && response.status === 404) return null;
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    const hint =
      response.status === 401 || response.status === 403
        ? " Check GITHUB_TOKEN permissions and GitHub API limits."
        : "";
    throw new Error(`GitHub API ${response.status}: ${body?.message || response.statusText}.${hint}`);
  }
  return (await response.json()) as T;
}

export function parseGitHubRepositoryUrl(input: string): GitHubRepoRef {
  const raw = input.trim();
  let url: URL;
  try {
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    throw new Error("Enter a valid GitHub repository URL, such as https://github.com/owner/repository.");
  }

  if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
    throw new Error("Only github.com repository URLs can be imported.");
  }

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2 || parts[0].toLowerCase() === "repos") {
    throw new Error(
      "This is not a repository URL. Use https://github.com/OWNER/REPOSITORY, not GitHub's generic /repos page."
    );
  }

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, "");
  if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) {
    throw new Error("The GitHub owner or repository name is invalid.");
  }
  return { owner, repo };
}

function decodeContent(content: GitHubContent | null) {
  if (!content?.content || content.encoding !== "base64") return "";
  try {
    return Buffer.from(content.content.replace(/\n/g, ""), "base64").toString("utf8");
  } catch {
    return "";
  }
}

function plainReadmeExcerpt(markdown: string) {
  if (!markdown) return null;
  const cleaned = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]>?\s+/gm, "")
    .replace(/[\*_`~|]/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned ? cleaned.slice(0, 520) : null;
}

const dependencyLabels: Record<string, string> = {
  next: "Next.js",
  react: "React",
  "react-native": "React Native",
  expo: "Expo",
  vue: "Vue",
  nuxt: "Nuxt",
  svelte: "Svelte",
  "@sveltejs/kit": "SvelteKit",
  angular: "Angular",
  express: "Express",
  fastify: "Fastify",
  nestjs: "NestJS",
  "@nestjs/core": "NestJS",
  typescript: "TypeScript",
  tailwindcss: "Tailwind CSS",
  "drizzle-orm": "Drizzle ORM",
  prisma: "Prisma",
  three: "Three.js",
  electron: "Electron",
  vite: "Vite",
  "framer-motion": "Framer Motion",
  stripe: "Stripe",
  "@supabase/supabase-js": "Supabase",
};

function inferTechnologies(
  languages: Record<string, number>,
  topics: string[],
  paths: string[],
  packageJson: string
) {
  const tech = new Set<string>();
  const sortedLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name]) => name);
  sortedLanguages.forEach((name) => tech.add(name));

  const lowerPaths = paths.map((p) => p.toLowerCase());
  const has = (file: string) => lowerPaths.some((p) => p === file || p.endsWith(`/${file}`));
  if (has("pubspec.yaml")) tech.add("Flutter");
  if (has("build.gradle") || has("build.gradle.kts")) tech.add("Android");
  if (has("podfile")) tech.add("iOS");
  if (has("requirements.txt") || has("pyproject.toml")) tech.add("Python");
  if (has("dockerfile") || has("docker-compose.yml") || has("compose.yaml")) tech.add("Docker");
  if (has("cargo.toml")) tech.add("Rust");
  if (has("go.mod")) tech.add("Go");
  if (has("composer.json")) tech.add("PHP");

  if (packageJson) {
    try {
      const pkg = JSON.parse(packageJson) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
      for (const name of Object.keys(dependencies)) {
        if (dependencyLabels[name]) tech.add(dependencyLabels[name]);
      }
    } catch {
      // A malformed package manifest should not block repository import.
    }
  }

  topics.slice(0, 6).forEach((topic) => {
    const normalized = topic
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    if (normalized.length <= 28) tech.add(normalized);
  });

  return Array.from(tech).slice(0, 12);
}

async function rootPackageJson(owner: string, repo: string) {
  const content = await githubJson<GitHubContent>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/package.json`,
    true
  );
  return decodeContent(content);
}

export async function inspectRepository(ref: GitHubRepoRef): Promise<InspectedRepository> {
  const owner = encodeURIComponent(ref.owner);
  const repo = encodeURIComponent(ref.repo);
  const metadata = await githubJson<GitHubRepo>(`/repos/${owner}/${repo}`);
  if (!metadata) throw new Error("Repository not found.");

  const [languages, readme, tree, packageJson] = await Promise.all([
    githubJson<Record<string, number>>(`/repos/${owner}/${repo}/languages`, true),
    githubJson<GitHubContent>(`/repos/${owner}/${repo}/readme`, true),
    githubJson<GitHubTree>(
      `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(metadata.default_branch)}?recursive=1`,
      true
    ),
    rootPackageJson(ref.owner, ref.repo),
  ]);

  const languageMap = languages || {};
  const topics = Array.isArray(metadata.topics) ? metadata.topics.slice(0, 16) : [];
  const paths = tree?.tree?.filter((item) => item.type === "blob").map((item) => item.path).slice(0, 5000) || [];
  const readmeExcerpt = plainReadmeExcerpt(decodeContent(readme));
  const summary = (metadata.description || readmeExcerpt || `${metadata.name} software project.`).slice(0, 600);

  return {
    githubId: String(metadata.id),
    owner: metadata.owner.login,
    repo: metadata.name,
    slug: `${metadata.owner.login}-${metadata.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name: metadata.name.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    summary,
    githubUrl: metadata.html_url,
    homepage: metadata.homepage?.trim() || null,
    language: metadata.language,
    topics,
    technologies: inferTechnologies(languageMap, topics, paths, packageJson),
    languages: languageMap,
    readmeExcerpt,
    visibility: metadata.visibility || (metadata.private ? "private" : "public"),
    stars: metadata.stargazers_count || 0,
    forks: metadata.forks_count || 0,
    archived: metadata.archived,
    pushedAt: metadata.pushed_at ? new Date(metadata.pushed_at) : null,
  };
}

export async function discoverAuthenticatedRepositories() {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(
      "GITHUB_TOKEN is not configured in this application runtime. Arena's account connection is not automatically shared with the website sandbox."
    );
  }
  const repositories = await githubJson<GitHubRepo[]>(
    "/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member"
  );
  return (repositories || []).filter((repo) => !repo.fork).map((repo) => ({
    owner: repo.owner.login,
    repo: repo.name,
    url: repo.html_url,
    private: repo.private,
    description: repo.description,
    updatedAt: repo.pushed_at,
  }));
}
