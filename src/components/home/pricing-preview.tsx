import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PRICING } from "@/lib/site";
import { Container, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion";
import TierCard from "@/components/tier-card";

export default function PricingPreview() {
  const tiers = PRICING.websites.tiers;
  return (
    <section className="py-24 md:py-36" aria-labelledby="pricing-h">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <SectionHead
              index="08"
              kicker="Pricing"
              title={<span id="pricing-h">Clear, honest starting prices.</span>}
              lead="Websites, apps and software — estimated packages with no surprises. Apps and custom software pricing live on the full pricing page."
            />
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/pricing"
              data-track="pricingpreview_all"
              className="group inline-flex items-center gap-2 text-sm font-medium"
            >
              Full pricing
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brandink">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 pt-4 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.09} className="h-full">
              <TierCard tier={t} trackPrefix="pricingpreview" />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 text-center text-sm text-mut">
            Need something custom? Every business is different —{" "}
            <Link
              href="/contact"
              data-track="pricingpreview_custom"
              className="font-medium text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
            >
              request a custom quote
            </Link>
            .
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
