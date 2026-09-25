import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEGAL } from "@/lib/site";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

export function generateStaticParams() {
  return Object.keys(LEGAL).map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const entry = LEGAL[doc];
  if (!entry) return { title: "Not found" };
  return {
    title: entry.title,
    description: entry.intro,
    alternates: { canonical: `/legal/${doc}` },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const entry = LEGAL[doc];
  if (!entry) notFound();

  return (
    <section className="relative overflow-hidden pt-40 pb-24 md:pt-52 md:pb-32">
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--halo)" }} />
      <Container className="relative">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <p className="kicker mb-6 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
              Legal
            </p>
            <h1 className="text-balance text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
              {entry.title}
            </h1>
            <p className="mt-6 text-pretty leading-relaxed text-mut">{entry.intro}</p>
          </Reveal>
          <div className="mt-12 space-y-8">
            {entry.sections.map((s, i) => (
              <Reveal key={s.h} delay={i * 0.05} y={16}>
                <div className="rounded-2xl border border-line p-6 sm:p-7">
                  <h2 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight">
                    <span className="font-mono text-[0.66rem] text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.h}
                  </h2>
                  <p className="mt-3 text-sm leading-[1.8] text-mut">{s.p}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-10 text-center text-[0.72rem] text-mut">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
