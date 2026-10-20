import Link from "next/link";
import Image from "next/image";
import { pageSeo } from "@/lib/seo";
import { BadgeCheck, Sparkle } from "lucide-react";
import { PRODUCTS } from "@/lib/site";
import { Button, Chip, Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import FinalCta from "@/components/home/final-cta";
import GithubWorkSection from "@/components/github-work-section";
import { getGithubProjects } from "@/lib/data";

export const revalidate = 300;

export const metadata = pageSeo("Work — Verified Projects & Product Concepts", "Verified Webloom software projects alongside clearly labeled products and product concepts — with source-derived technology profiles and no fabricated client claims.", "/work");

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
                  {/* Source-informed concept illustration; not a product screenshot. */}
                  <div className="relative min-h-64 overflow-hidden bg-elev lg:min-h-full">
                    <Image
                      src={p.image}
                      alt={`${p.name} illustrative product artwork, not a screenshot`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    />
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
                    <div className="absolute left-6 top-6">
                      <Chip className="border-white/20 bg-black/60 text-white backdrop-blur-sm">
                        <Sparkle className="h-3 w-3" />
                        {p.label}
                      </Chip>
                    </div>
                    <span className="absolute bottom-5 left-6 font-mono text-[0.65rem] tracking-[0.12em] text-white/80 uppercase">
                      Illustrative artwork
                    </span>
                    <span aria-hidden="true" className="absolute bottom-4 right-6 font-mono text-5xl font-bold text-white/35">
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

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link href={`/work/${p.slug}`} className="inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brandink transition-opacity hover:opacity-80">
                        View {p.name} details
                      </Link>
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
