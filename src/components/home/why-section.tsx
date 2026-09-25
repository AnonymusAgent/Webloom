import { WHY } from "@/lib/site";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

export default function WhySection() {
  return (
    <section className="relative py-24 md:py-36" aria-labelledby="why-h">
      <Container>
        <Reveal>
          <p className="kicker mb-5 flex items-center gap-3">
            <span className="text-mut">03</span>
            <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
            Why Webloom
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            id="why-h"
            className="max-w-4xl text-balance text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
          >
            Built <span className="text-gradient-brand">differently.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-mut md:text-lg">
            Most teams ship screens. We ship products — considered from the business goal to the
            last micro-interaction.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <div key={w.title} className="group relative bg-bg p-8 transition-colors duration-500 hover:bg-card">
              <Reveal delay={(i % 3) * 0.08} y={20}>
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line text-brand transition-all duration-500 group-hover:scale-110 group-hover:border-brand/40">
                    <w.icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <span className="font-mono text-[0.66rem] text-mut">0{i + 1}</span>
                </div>
                <h3 className="mt-7 text-lg font-semibold tracking-tight">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mut">{w.blurb}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
