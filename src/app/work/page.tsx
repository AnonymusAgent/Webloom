import type { Metadata } from "next";
import { BadgeCheck, Sparkle } from "lucide-react";
import { PRODUCTS } from "@/lib/site";
import { Button, Chip, Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import FinalCta from "@/components/home/final-cta";
import GithubWorkSection from "@/components/github-work-section";
import { getGithubProjects } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Work — Verified Projects & Product Concepts",
  description:
    "Verified Webloom software projects alongside clearly labeled products and product concepts — with source-derived technology profiles and no fabricated client claims.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const githubProjects = await getGithubProjects();

  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-16 md:pt-52 md:pb-24">
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--halo)" }} />
        <Container className="relative">
          <Reveal>
            <p className="kicker mb-6 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
              Work
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-4xl text-balance text-[clamp(2.6rem,6.5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              Real builds. <span className="text-gradient-brand">Honest context.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-mut md:text-lg">
              Source-verified projects from Webloom&apos;s public GitHub, followed by clearly labeled
              product concepts. No invented clients, awards or results—just the work, the stack and
              what was actually implemented.
            </p>
          </Reveal>
        </Container>
      </section>

      <GithubWorkSection projects={githubProjects} />

      <section className="pb-10" aria-label="Product concepts">
        <Container className="space-y-6">
          {githubProjects.length > 0 && (
            <Reveal>
              <div className="pb-6 pt-4">
                <p className="kicker mb-4">Product concepts</p>
                <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Capabilities demonstrated through concepts.
                </h2>
              </div>
            </Reveal>
          )}
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} y={32}>
              <article
                id={p.slug}
                className="card-surface group scroll-mt-32 overflow-hidden rounded-[2rem]"
              >
                <div className="grid lg:grid-cols-[1fr_1.15fr]">
                  {/* art side */}
                  <div
                    className="relative min-h-64 overflow-hidden lg:min-h-full"
                    style={{
                      background: `linear-gradient(150deg, color-mix(in oklab, var(--brand) 14%, var(--bg2)), var(--bg2) 60%)`,
                      filter: `hue-rotate(${p.hue === "160deg" ? "0deg" : p.hue})`,
                    }}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-10">
                      <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-line2 bg-elev/70 shadow-soft backdrop-blur-md transition-transform duration-700 group-hover:rotate-6 group-hover:scale-105 sm:h-32 sm:w-32">
                        <p.icon className="h-12 w-12 text-brand" strokeWidth={1.3} />
                        <span className="ring-bloom" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="absolute left-6 top-6 flex gap-2">
                      <Chip className="border-brand/30 bg-bg/60 text-brand backdrop-blur-sm">
                        <Sparkle className="h-3 w-3" />
                        {p.label}
                      </Chip>
                    </div>
                    <span
                      aria-hidden="true"
                      className="absolute bottom-4 right-6 font-mono text-6xl font-bold text-ink/[0.05]"
                    >
                      0{i + 1}
                    </span>
                  </div>

                  {/* content side */}
                  <div className="p-8 sm:p-12">
                    <p className="font-mono text-[0.64rem] tracking-[0.2em] text-brand uppercase">
                      {p.category}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{p.name}</h2>
                    <p className="mt-4 max-w-lg text-pretty leading-relaxed text-mut">{p.blurb}</p>

                    <div className="mt-7">
                      <p className="kicker mb-4 text-[0.62rem]">Key features</p>
                      <ul className="flex flex-wrap gap-1.5">
                        {p.features.map((f) => (
                          <li
                            key={f}
                            className="rounded-full border border-line px-3 py-1.5 text-[0.75rem] text-mut transition-colors hover:border-line2 hover:text-ink"
                          >
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {p.serves && (
                      <div className="mt-6">
                        <p className="kicker mb-4 text-[0.62rem]">Designed for</p>
                        <p className="text-[0.8rem] leading-relaxed text-mut">{p.serves.join(" · ")}</p>
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-brand/10 px-3 py-1 font-mono text-[0.66rem] text-brand"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-elev/40 p-4">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <p className="text-sm italic leading-relaxed text-mut">“{p.outcome}”</p>
                    </div>

                    <div className="mt-8">
                      <Button
                        href={`/contact?ref=${p.slug}`}
                        variant="secondary"
                        track={`work_${p.slug}`}
                      >
                        Build something like this
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
