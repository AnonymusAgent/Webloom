"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  ExternalLink,
  GitBranch,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import type { GithubProject } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import {
  AdButton,
  AdField,
  EmptyState,
  PanelCard,
  Toggle,
  adInput,
} from "@/components/admin/admin-ui";

type DiscoveredRepo = {
  owner: string;
  repo: string;
  url: string;
  private: boolean;
  description: string | null;
  updatedAt: string | null;
};

type EditForm = {
  id: string;
  name: string;
  category: string;
  summary: string;
  homepage: string;
  published: boolean;
  featured: boolean;
};

async function request(method = "GET", body?: unknown) {
  const response = await fetch("/api/admin/github", {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "GitHub request failed.");
  return data;
}

export default function GithubProjectsPanel() {
  const [projects, setProjects] = useState<GithubProject[] | null>(null);
  const [tokenConfigured, setTokenConfigured] = useState(false);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [discovered, setDiscovered] = useState<DiscoveredRepo[]>([]);
  const [edit, setEdit] = useState<EditForm | null>(null);

  const load = useCallback(async () => {
    const data = await request();
    setProjects(data.projects);
    setTokenConfigured(Boolean(data.tokenConfigured));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load().catch((reason) => {
        setProjects([]);
        setError(reason instanceof Error ? reason.message : "Could not load GitHub projects.");
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function importUrl(repositoryUrl = url) {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const data = await request("POST", { url: repositoryUrl });
      setUrl("");
      setSuccess(`${data.project.owner}/${data.project.repo} was inspected and saved as an unpublished draft.`);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Import failed.");
    } finally {
      setBusy(false);
    }
  }

  async function discover() {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const data = await request("POST", { action: "discover" });
      setDiscovered(data.repositories || []);
      setSuccess(`Found ${data.repositories?.length || 0} non-fork repositories accessible to the configured token.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Discovery failed.");
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit() {
    if (!edit) return;
    setBusy(true);
    setError("");
    try {
      await request("PATCH", edit);
      setEdit(null);
      setSuccess("Project presentation updated.");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(project: GithubProject, field: "published" | "featured", value: boolean) {
    setProjects((current) =>
      current?.map((item) => (item.id === project.id ? { ...item, [field]: value } : item)) || null
    );
    try {
      await request("PATCH", { id: project.id, [field]: value });
    } catch (reason) {
      await load();
      setError(reason instanceof Error ? reason.message : "Update failed.");
    }
  }

  async function remove(project: GithubProject) {
    if (!confirm(`Remove ${project.owner}/${project.repo} from Webloom? This does not affect GitHub.`)) return;
    await request("DELETE", { id: project.id });
    await load();
  }

  return (
    <div className="space-y-5">
      <PanelCard>
        <div className="flex items-start gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line text-brand">
            <Code2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Import verified GitHub work</h3>
            <p className="mt-1.5 max-w-2xl text-[0.8rem] leading-relaxed text-mut">
              Import a specific repository URL. Webloom reads GitHub metadata, languages, topics,
              README content, the source tree, and root package dependencies to infer the stack.
              Every import stays unpublished until you review it.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            className={adInput}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && url.trim() && !busy) void importUrl();
            }}
            placeholder="https://github.com/owner/repository"
            aria-label="GitHub repository URL"
          />
          <AdButton onClick={() => importUrl()} disabled={busy || !url.trim()} className="shrink-0">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Inspect & import
          </AdButton>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <AdButton variant="ghost" onClick={discover} disabled={busy || !tokenConfigured}>
            <GitBranch className="h-3.5 w-3.5" /> Discover connected repositories
          </AdButton>
          <span className={`text-[0.7rem] ${tokenConfigured ? "text-brand" : "text-mut"}`}>
            {tokenConfigured
              ? "GITHUB_TOKEN is available to this server."
              : "GITHUB_TOKEN is not available. Public URL imports still work."}
          </span>
        </div>

        {error && (
          <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs leading-relaxed text-red-300">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
          </p>
        )}
        {success && (
          <p role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-xs leading-relaxed text-brand">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {success}
          </p>
        )}
      </PanelCard>

      {discovered.length > 0 && (
        <PanelCard>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold tracking-tight">Connected repositories</h3>
              <p className="mt-1 text-[0.75rem] text-mut">Select repositories individually. Forks are excluded.</p>
            </div>
            <button type="button" onClick={() => setDiscovered([])} aria-label="Close discovered repositories" className="text-mut hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {discovered.map((repo) => {
              const imported = projects?.some(
                (project) => project.owner.toLowerCase() === repo.owner.toLowerCase() && project.repo.toLowerCase() === repo.repo.toLowerCase()
              );
              return (
                <div key={`${repo.owner}/${repo.repo}`} className="flex items-center gap-3 rounded-2xl border border-line p-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{repo.owner}/{repo.repo}</p>
                    <p className="mt-0.5 truncate text-[0.7rem] text-mut">
                      {repo.private ? "Private" : "Public"}{repo.description ? ` · ${repo.description}` : ""}
                    </p>
                  </div>
                  <AdButton
                    variant={imported ? "ghost" : "primary"}
                    onClick={() => importUrl(repo.url)}
                    disabled={busy}
                  >
                    {imported ? <RefreshCw className="h-3.5 w-3.5" /> : "Import"}
                  </AdButton>
                </div>
              );
            })}
          </div>
        </PanelCard>
      )}

      {edit && (
        <PanelCard>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="font-semibold tracking-tight">Review project presentation</h3>
            <AdButton variant="ghost" onClick={() => setEdit(null)}>
              <X className="h-3.5 w-3.5" /> Cancel
            </AdButton>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdField label="Public project name">
              <input className={adInput} value={edit.name} onChange={(event) => setEdit({ ...edit, name: event.target.value })} />
            </AdField>
            <AdField label="Project category">
              <input className={adInput} value={edit.category} onChange={(event) => setEdit({ ...edit, category: event.target.value })} />
            </AdField>
            <AdField label="Live product URL (optional)">
              <input className={adInput} value={edit.homepage} onChange={(event) => setEdit({ ...edit, homepage: event.target.value })} placeholder="https://…" />
            </AdField>
          </div>
          <AdField label="Public summary" className="mt-4">
            <textarea className={`${adInput} min-h-28 resize-y`} value={edit.summary} onChange={(event) => setEdit({ ...edit, summary: event.target.value })} />
          </AdField>
          <div className="mt-5 flex flex-wrap items-center gap-6">
            <Toggle checked={edit.published} onChange={(value) => setEdit({ ...edit, published: value })} label="Published" />
            <Toggle checked={edit.featured} onChange={(value) => setEdit({ ...edit, featured: value })} label="Featured" />
            <AdButton onClick={saveEdit} disabled={busy || !edit.name.trim()} className="ml-auto">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save review
            </AdButton>
          </div>
        </PanelCard>
      )}

      {!projects ? (
        <p className="py-10 text-center text-sm text-mut">Loading verified projects…</p>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No GitHub projects imported"
          blurb="The generic github.com/repos page cannot identify an account. Import specific repository URLs above; verified projects remain drafts until approved."
        />
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const technologies = Array.isArray(project.technologies)
              ? (project.technologies as string[])
              : [];
            return (
              <PanelCard key={project.id} className="rounded-2xl p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-brand">
                    <Code2 className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold tracking-tight">{project.name}</p>
                      <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.58rem] text-mut">
                        {project.category}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 font-mono text-[0.58rem] uppercase ${project.visibility === "private" ? "border-amber-400/30 bg-amber-400/10 text-amber-400" : "border-brand/30 bg-brand/10 text-brand"}`}>
                        {project.visibility}
                      </span>
                      {project.archived && <span className="text-[0.65rem] text-amber-400">Archived</span>}
                    </div>
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-mut hover:text-brand">
                      {project.owner}/{project.repo} <ExternalLink className="h-3 w-3" />
                    </a>
                    <p className="mt-2 line-clamp-2 text-[0.8rem] leading-relaxed text-mut">{project.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {technologies.slice(0, 8).map((technology) => (
                        <span key={technology} className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.62rem] text-mut">
                          {technology}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 flex flex-wrap gap-3 font-mono text-[0.62rem] text-mut">
                      <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" /> {project.stars}</span>
                      <span>{project.language || "Mixed stack"}</span>
                      <span>Synced {formatDate(project.fetchedAt)}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-2">
                      <AdButton variant="ghost" onClick={() => importUrl(project.githubUrl)} disabled={busy}>
                        <RefreshCw className="h-3.5 w-3.5" />
                      </AdButton>
                      <AdButton
                        variant="ghost"
                        onClick={() =>
                          setEdit({
                            id: project.id,
                            name: project.name,
                            category: project.category,
                            summary: project.summary,
                            homepage: project.homepage || "",
                            published: project.published,
                            featured: project.featured,
                          })
                        }
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </AdButton>
                      <AdButton variant="danger" onClick={() => remove(project)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </AdButton>
                    </div>
                    <Toggle checked={project.published} onChange={(value) => toggle(project, "published", value)} label="Published" />
                    <Toggle checked={project.featured} onChange={(value) => toggle(project, "featured", value)} label="Featured" />
                  </div>
                </div>
              </PanelCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
