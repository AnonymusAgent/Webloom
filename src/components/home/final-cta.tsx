import { Container, Button } from "@/components/ui";
import { Reveal } from "@/components/motion";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28 md:py-44" aria-labelledby="cta-h">
      {/* bloom rings */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[420, 620, 860, 1140].map((s, i) => (
          <span
            key={s}
            className="absolute rounded-full border border-line"
            style={{
              width: s,
              height: s,
              opacity: 0.9 - i * 0.22,
              animation: `floaty ${7 + i * 1.4}s ease-in-out ${i * 0.7}s infinite`,
            }}
          />
        ))}
        <span
          className="absolute h-[500px] w-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--brand) 14%, transparent), transparent 65%)" }}
        />
      </div>

      <Container className="relative text-center">
        <Reveal>
          <p className="kicker mb-6 flex items-center justify-center gap-3">
            <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
            Start
            <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            id="cta-h"
            className="mx-auto max-w-3xl text-balance text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[1.03] tracking-[-0.03em]"
          >
            Have an idea? <span className="text-gradient-brand">Let&apos;s make it real.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-mut md:text-lg">
            Tell Webloom what you&apos;re building. We&apos;ll help turn the idea into a product
            people want to use.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg" track="finalcta_start_project">
              Start a Project
            </Button>
            <Button href="/pricing" size="lg" variant="secondary" track="finalcta_pricing">
              View Pricing
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
