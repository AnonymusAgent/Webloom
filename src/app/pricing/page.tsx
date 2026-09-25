import type { Metadata } from "next";
import PricingTabs, { CombinationNote } from "@/components/pricing/pricing-tabs";
import Estimator from "@/components/pricing/estimator";
import Faq, { FaqJsonLd } from "@/components/faq";
import FinalCta from "@/components/home/final-cta";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getFaqs } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Pricing — Websites, Apps, Software & SaaS",
  description:
    "Transparent starting prices for websites (from $299), mobile apps (from $999), custom software (from $2,500+) and SaaS platforms — plus a quick project estimator.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const faqs = await getFaqs();

  return (
    <>
      <FaqJsonLd items={faqs} />
      <section className="relative overflow-hidden pt-40 pb-16 md:pt-52 md:pb-20">
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--halo)" }} />
        <Container className="relative text-center">
          <Reveal>
            <p className="kicker mb-6 flex items-center justify-center gap-3">
              <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
              Pricing
              <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mx-auto max-w-3xl text-balance text-[clamp(2.6rem,6.5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              Pricing, <span className="text-gradient-brand">without the fog.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed text-mut md:text-lg">
              All packages are starting prices and estimates — every project receives a clear,
              written proposal before work begins. No surprise invoices, ever.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-8" aria-label="Pricing packages">
        <Container>
          <PricingTabs />
          <CombinationNote />
        </Container>
      </section>

      <section className="py-20 md:py-28" aria-label="Project estimator">
        <Container>
          <Estimator />
        </Container>
      </section>

      <section id="faq" className="scroll-mt-28 py-20 md:py-28" aria-labelledby="pf-h">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <p className="kicker mb-5 flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
                FAQ
              </p>
              <h2 id="pf-h" className="text-balance text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
                Good questions, straight answers.
              </h2>
              <p className="mt-5 text-pretty text-base leading-relaxed text-mut">
                Costs, timelines, platforms, maintenance — the things everyone asks before starting.
              </p>
            </Reveal>
            <Faq items={faqs} />
          </div>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
