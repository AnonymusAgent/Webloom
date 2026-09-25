import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Code2 } from "lucide-react";
import type { GithubProject } from "@/db/schema";
import { Container, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion";

export default function GithubWorkPreview({ projects }: { projects: GithubProject[] }) {
  const featured = projects.filter((project) => project.featured).slice(0, 4);
  if (featured.length === 0) return null;

  return (
    <section className="py-24 md:py-36" aria-labelledby="verified-work-h">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <SectionHead
              index="04"
              kicker="Verified work"
              title={<span id="verified-work-h">Real products, visible in the source.</span>}
              lead="Selected builds from Webloom's public GitHub—described from the screens, components, services and manifests actually implemented."
            />
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/work"
              data-track="verified_work_all"
              className="group inline-flex items-center gap-2 text-sm font-medium"
            >
              View all projects
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brandink">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {featured.map((project, index) => {
            const stack = Array.isArray(project.technologies)
              ? (project.technologies as string[]).slice(0, 4)
              : [];
            return (
              <Reveal key={project.id} delay={(index % 2) * 0.08} className="h-full">
                <Link
                  href={`/work#${project.slug}`}
                  data-track={`home_github_${project.slug}`}
                  className="card-surface group/card flex h-full flex-col overflow-hidden"
                >
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-elev">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={`${project.name} product visualization`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover/card:scale-[1.04]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--halo)" }}>
                        <Code2 className="h-12 w-12 text-brand" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[0.65rem] font-medium text-white backdrop-blur-md">
                      <BadgeCheck className="h-3 w-3 text-brand" /> Source verified
                    </span>
                  </div>
                  <div className="flex flex-1 items-end justify-between gap-5 p-6 sm:p-7">
                    <div>
                      <p className="font-mono text-[0.6rem] tracking-[0.16em] text-brand uppercase">{project.category}</p>
                      <h3 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">{project.name}</h3>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {stack.map((item) => (
                          <span key={item} className="rounded-full border border-line px-2.5 py-1 text-[0.62rem] text-mut">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover/card:border-brand group-hover/card:bg-brand group-hover/card:text-brandink">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
