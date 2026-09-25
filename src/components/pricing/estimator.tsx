"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { ESTIMATOR } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion";

type Answers = {
  type: string;
  features: number;
  options: string[];
  timeframe: string;
};

function estimate(a: Answers) {
  const t = ESTIMATOR.types.find((x) => x.id === a.type) ?? ESTIMATOR.types[0];
  let total = t.base + a.features * t.perFeature;
  for (const id of a.options) {
    total += ESTIMATOR.options.find((o) => o.id === id)?.add ?? 0;
  }
  total *= ESTIMATOR.timeframes.find((x) => x.id === a.timeframe)?.mult ?? 1;
  const round = (n: number) => Math.round(n / 50) * 50;
  return [round(total * 0.8), round(total * 1.35)];
}

export default function Estimator() {
  const [answers, setAnswers] = useState<Answers>({
    type: "website",
    features: 5,
    options: ["backend"],
    timeframe: "1-2",
  });
  const [lo, hi] = useMemo(() => estimate(answers), [answers]);

  const toggle = (id: string) =>
    setAnswers((a) => ({
      ...a,
      options: a.options.includes(id) ? a.options.filter((o) => o !== id) : [...a.options, id],
    }));

  const reset = () =>
    setAnswers({ type: "website", features: 5, options: ["backend"], timeframe: "1-2" });

  return (
    <Reveal>
      <div className="card-surface overflow-hidden rounded-[2rem]">
        <div className="grid lg:grid-cols-[1.35fr_1fr]">
          {/* form side */}
          <div className="p-8 sm:p-12">
            <p className="kicker mb-3 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" /> Project estimator
            </p>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Rough idea of your budget?
            </h3>
            <p className="mt-2 text-sm text-mut">
              Answer five quick questions. This is a directional estimate — not a quotation.
            </p>

            <div className="mt-10 space-y-9">
              {/* 1. type */}
              <fieldset>
                <legend className="mb-3.5 flex items-center gap-3 text-sm font-medium">
                  <span className="font-mono text-[0.66rem] text-brand">01</span>
                  What are you building?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {ESTIMATOR.types.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      data-track="estimator_type"
                      onClick={() => setAnswers((a) => ({ ...a, type: t.id }))}
                      aria-pressed={answers.type === t.id}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-all duration-300",
                        answers.type === t.id
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-line text-mut hover:border-line2 hover:text-ink"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* 2. features */}
              <fieldset>
                <legend className="mb-3.5 flex items-center gap-3 text-sm font-medium">
                  <span className="font-mono text-[0.66rem] text-brand">02</span>
                  Number of major features
                  <span className="ml-auto rounded-full bg-brand/10 px-3 py-1 font-mono text-[0.72rem] text-brand">
                    {answers.features}
                  </span>
                </legend>
                <input
                  type="range"
                  min={2}
                  max={20}
                  value={answers.features}
                  data-track="estimator_features"
                  onChange={(e) => setAnswers((a) => ({ ...a, features: Number(e.target.value) }))}
                  aria-label="Number of major features"
                  className="w-full accent-[var(--brand)]"
                />
                <div className="mt-1.5 flex justify-between text-[0.66rem] text-mut">
                  <span>Focused</span>
                  <span>Comprehensive</span>
                </div>
              </fieldset>

              {/* 3. options */}
              <fieldset>
                <legend className="mb-3.5 flex items-center gap-3 text-sm font-medium">
                  <span className="font-mono text-[0.66rem] text-brand">03</span>
                  What else does it need?
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ESTIMATOR.options.map((o) => {
                    const on = answers.options.includes(o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        data-track="estimator_option"
                        onClick={() => toggle(o.id)}
                        aria-pressed={on}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-all duration-300",
                          on
                            ? "border-brand bg-brand/10 text-ink"
                            : "border-line text-mut hover:border-line2 hover:text-ink"
                        )}
                      >
                        {o.label}
                        <span
                          className={cn(
                            "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                            on ? "border-brand bg-brand text-brandink" : "border-line2"
                          )}
                        >
                          {on && <Check className="h-3 w-3" strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* 4. timeframe */}
              <fieldset>
                <legend className="mb-3.5 flex items-center gap-3 text-sm font-medium">
                  <span className="font-mono text-[0.66rem] text-brand">04</span>
                  Desired launch timeframe
                </legend>
                <div className="flex flex-wrap gap-2">
                  {ESTIMATOR.timeframes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      data-track="estimator_timeframe"
                      onClick={() => setAnswers((a) => ({ ...a, timeframe: t.id }))}
                      aria-pressed={answers.timeframe === t.id}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-all duration-300",
                        answers.timeframe === t.id
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-line text-mut hover:border-line2 hover:text-ink"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          {/* result side */}
          <div className="relative flex flex-col justify-between gap-8 border-t border-line bg-card p-8 sm:p-12 lg:border-l lg:border-t-0">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "var(--halo)" }} />
            <div className="relative">
              <p className="kicker">05 — Estimated project range</p>
              <p aria-live="polite" className="mt-6 text-[clamp(2.2rem,4vw,3.4rem)] font-semibold leading-none tracking-tight">
                ${lo.toLocaleString()}
                <span className="mx-2 text-mut">–</span>${hi.toLocaleString()}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-mut">
                This range is a directional estimate based on typical Webloom projects — not a
                quotation. Your final proposal depends on scope, design depth and integrations.
              </p>
            </div>
            <div className="relative flex flex-col gap-3">
              <Link
                href="/contact?ref=estimator"
                data-track="estimator_talk"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-brandink transition-all hover:shadow-[0_8px_30px_-6px_var(--brand)]"
              >
                Talk to Webloom
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-mut transition-all hover:border-line2 hover:text-ink"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
