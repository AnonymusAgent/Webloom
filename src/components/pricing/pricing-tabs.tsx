"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRICING } from "@/lib/site";
import { EASE, Reveal } from "@/components/motion";
import TierCard from "@/components/tier-card";

const KEYS = Object.keys(PRICING) as (keyof typeof PRICING)[];

export default function PricingTabs() {
  const [active, setActive] = useState<(typeof KEYS)[number]>("websites");

  useEffect(() => {
    const read = () => {
      const hash = window.location.hash.replace("#", "");
      if ((KEYS as string[]).includes(hash)) setActive(hash as (typeof KEYS)[number]);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  function onKeyDown(e: KeyboardEvent) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const i = KEYS.indexOf(active);
    const next =
      e.key === "ArrowRight"
        ? KEYS[(i + 1) % KEYS.length]
        : e.key === "ArrowLeft"
          ? KEYS[(i - 1 + KEYS.length) % KEYS.length]
          : e.key === "Home"
            ? KEYS[0]
            : KEYS[KEYS.length - 1];
    setActive(next);
    document.getElementById(next)?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Pricing categories"
        onKeyDown={onKeyDown}
        className="mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full border border-line bg-card p-1.5"
      >
        {KEYS.map((key) => (
          <button
            key={key}
            role="tab"
            id={key}
            aria-selected={active === key}
            tabIndex={active === key ? 0 : -1}
            data-track={`pricing_tab_${key}`}
            onClick={() => setActive(key)}
            className={`relative rounded-full px-4 py-2 text-[0.82rem] font-medium whitespace-nowrap transition-colors duration-300 sm:px-5 ${
              active === key ? "text-brandink" : "text-mut hover:text-ink"
            }`}
          >
            {active === key && (
              <motion.span
                layoutId="pricing-tab"
                className="absolute inset-0 rounded-full bg-brand"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative z-10">{PRICING[key].label}</span>
          </button>
        ))}
      </div>

      <div className="mt-10" role="tabpanel" aria-labelledby={active}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={`grid gap-5 pt-4 ${
              PRICING[active].tiers.length === 1
                ? "mx-auto max-w-xl"
                : PRICING[active].tiers.length === 2
                  ? "mx-auto max-w-3xl md:grid-cols-2"
                  : "lg:grid-cols-3"
            }`}
          >
            {PRICING[active].tiers.map((t) => (
              <TierCard key={t.name} tier={t} trackPrefix={`pricing_${active}`} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function CombinationNote() {
  return (
    <Reveal>
      <div className="card-surface mx-auto mt-16 flex max-w-3xl flex-col items-center gap-4 rounded-3xl p-8 text-center sm:p-10">
        <p className="kicker">Need a combination?</p>
        <h3 className="text-balance text-2xl font-semibold tracking-tight">
          Website + Mobile App + Admin Dashboard?
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-mut">
          Most real products span more than one category. Tell us what you&apos;re building and
          we&apos;ll create a tailored proposal with combined pricing.
        </p>
        <a
          href="/contact?type=combination"
          data-track="pricing_combination"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brandink transition-all hover:shadow-[0_8px_30px_-6px_var(--brand)]"
        >
          Request a Custom Quote
        </a>
      </div>
    </Reveal>
  );
}
