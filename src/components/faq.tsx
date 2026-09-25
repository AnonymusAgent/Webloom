"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/lib/data";
import { Reveal, EASE } from "@/components/motion";

export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === item.id;
        return (
          <Reveal key={item.id} delay={Math.min(i * 0.04, 0.3)} y={14}>
            <div>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${item.id}`}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6"
              >
                <span className="flex items-baseline gap-4">
                  <span className="hidden font-mono text-[0.66rem] text-mut sm:block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-base font-medium tracking-tight transition-colors duration-300 sm:text-lg ${
                      isOpen ? "text-brand" : "text-ink group-hover:text-brand"
                    }`}
                  >
                    {item.question}
                  </span>
                </span>
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-400 ${
                    isOpen ? "rotate-45 border-brand bg-brand text-brandink" : "border-line text-mut group-hover:border-line2"
                  }`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-a-${item.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-6 text-sm leading-relaxed text-mut sm:pl-10 sm:text-[0.95rem]">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
