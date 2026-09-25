import Image from "next/image";
import {
  ArrowUpRight,
  BadgeCheck,
  Code2,
  ExternalLink,
  GitFork,
  LockKeyhole,
  Star,
} from "lucide-react";
import type { GithubProject } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { Button, Chip, Container, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion";

function technologies(project: GithubProject) {
  return Array.isArray(project.technologies) ? (project.technologies as string[]) : [];
}

function topics(project: GithubProject) {
  return Array.isArray(project.topics) ? (project.topics as string[]) : [];
}

function FeaturedProject({ project, index }: { project: GithubProject; index: number }) {
  const stack = technologies(project);
  const repoTopics = topics(project);
  const isPublic = project.visibility === "public";

  return (
    <Reveal delay={(index % 2) * 0.09} className="h-full">
      <article id={project.slug} className="card-surface group flex h-full scroll-mt-32 flex-col overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-elev">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.name} product visualization`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--halo)" }}>
              <Code2 className="h-14 w-14 text-brand" strokeWidth={1.2} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute left-5 top-5">
            <Chip className="border-white/20 bg-black/40 text-white backdrop-blur-md">
              <BadgeCheck className="h-3 w-3 text-brand" /> Source verified
            </Chip>
          </div>
          <span className="absolute bottom-4 right-5 font-mono text-xs text-white/70">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-7 sm:p-9">
          <div>
            <p className="font-mono text-[0.64rem] tracking-[0.18em] text-brand uppercase">
              {project.category}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{project.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mut">{project.summary}</p>
          </div>

          {stack.length > 0 && (
            <div className="mt-6">
              <p className="kicker mb-3 text-[0.6rem]">Technology profile</p>
              <ul className="flex flex-wrap gap-1.5">
                {stack.map((technology) => (
                  <li key={technology} className="rounded-full border border-line px-3 py-1.5 text-[0.7rem] text-mut">
                    {technology}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {repoTopics.length > 0 && (
            <p className="mt-5 text-[0.72rem] leading-relaxed text-mut">
              <span className="font-medium text-ink">Repository topics: </span>
              {repoTopics.slice(0, 8).join(" · ")}
            </p>
          )}

          <div className="mt-auto pt-7">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-5 font-mono text-[0.66rem] text-mut">
              {project.language && <span>{project.language}</span>}
              {isPublic ? (
                <>
                  <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" /> {project.stars}</span>
                  <span className="inline-flex items-center gap-1"><GitFork className="h-3 w-3" /> {project.forks}</span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1"><LockKeyhole className="h-3 w-3" /> Private source</span>
              )}
              {project.pushedAt && <span>Updated {formatDate(project.pushedAt)}</span>}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {project.homepage && (
                <Button href={project.homepage} external variant="secondary" track={`github_demo_${project.slug}`}>
                  View live product
                </Button>
              )}
              {isPublic && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-track={`github_source_${project.slug}`}
                  className="group/link inline-flex items-center gap-2 rounded-full border border-line2 px-5 py-2.5 text-sm font-medium text-ink transition-all hover:border-brand hover:text-brand"
                >
                  View source
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ArchiveProject({ project, index }: { project: GithubProject; index: number }) {
  const stack = technologies(project).slice(0, 4);
  const isPublic = project.visibility === "public";

  return (
    <Reveal delay={(index % 2) * 0.06} y={16}>
      <article className="group flex h-full flex-col rounded-2xl border border-line p-5 transition-all duration-400 hover:-translate-y-1 hover:border-line2 hover:bg-card">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[0.6rem] tracking-[0.16em] text-brand uppercase">{project.category}</p>
            <h3 className="mt-1.5 text-lg font-semibold tracking-tight">{project.name}</h3>
            <p className="mt-0.5 truncate font-mono text-[0.62rem] text-mut">{project.owner}/{project.repo}</p>
          </div>
          {isPublic ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.name} source on GitHub`}
              data-track={`github_archive_${project.slug}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-mut transition-all hover:border-brand hover:bg-brand hover:text-brandink"
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : (
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-mut">
              <LockKeyhole className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
        <p className="mt-3 flex-1 text-[0.8rem] leading-relaxed text-mut">{project.summary}</p>
        {stack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {stack.map((technology) => (
              <span key={technology} className="rounded-full bg-brand/8 px-2.5 py-1 font-mono text-[0.6rem] text-brand">
                {technology}
              </span>
            ))}
          </div>
        )}
      </article>
    </Reveal>
  );
}

export default function GithubWorkSection({ projects }: { projects: GithubProject[] }) {
  if (projects.length === 0) return null;
  const featured = projects.filter((project) => project.featured);
  const archive = projects.filter((project) => !project.featured);

  return (
    <section className="pb-24 md:pb-36" aria-labelledby="github-work-h">
      <Container>
        <Reveal>
          <SectionHead
            kicker="Verified work"
            title={<span id="github-work-h">Projects verified from source.</span>}
            lead="Real repositories from Webloom's GitHub. Every description and technology label is grounded in routes, components, manifests, dependencies and source structure—not fabricated client claims."
          />
        </Reveal>

        {featured.length > 0 && (
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {featured.map((project, index) => (
              <FeaturedProject key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {archive.length > 0 && (
          <div className={featured.length > 0 ? "mt-20" : "mt-14"}>
            <Reveal>
              <p className="kicker mb-4">Source archive</p>
              <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Supporting builds and product iterations.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-mut">
                Earlier prototypes, companion applications and focused interface experiments that
                show how these product ideas evolved.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {archive.map((project, index) => (
                <ArchiveProject key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
