import { Check, Sparkles } from "lucide-react";
import type { Tier } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

export default function TierCard({
  tier,
  trackPrefix,
  compact = false,
}: {
  tier: Tier;
  trackPrefix: string;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "card-surface relative flex h-full flex-col p-7 sm:p-8",
        tier.featured && "border-brand/50 shadow-[0_0_60px_-20px_var(--brand)]"
      )}
    >
      {tier.featured && (
        <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-3.5 py-1 text-[0.68rem] font-semibold text-brandink shadow-soft">
          <Sparkles className="h-3 w-3" />
          Most popular
        </span>
      )}
      <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-mono text-[0.66rem] tracking-[0.14em] text-mut uppercase">from</span>
        <span className="text-4xl font-semibold tracking-tight sm:text-[2.6rem]">{tier.price}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-mut">{tier.blurb}</p>

      <ul className={`mt-6 space-y-2.5 ${compact ? "" : "flex-1"}`}>
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-mut">
            <span className="mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-brand/12 text-brand">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-7">
        <Button
          href={`/contact?plan=${encodeURIComponent(tier.name)}`}
          variant={tier.featured ? "primary" : "secondary"}
          className="w-full"
          track={`${trackPrefix}_${tier.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
        >
          {tier.cta}
        </Button>
      </div>
    </article>
  );
}
