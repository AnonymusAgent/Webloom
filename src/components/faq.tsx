import { Plus } from "lucide-react";
import type { FaqItem } from "@/lib/data";
import { jsonLd } from "@/lib/json-ld";

/** Native disclosure controls work before hydration and with reduced motion. */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, index) => (
        <details key={item.id} name="webloom-faq" open={index === 0} className="group">
          <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-6 py-5 text-left sm:py-6 [&::-webkit-details-marker]:hidden">
            <span className="flex items-baseline gap-4">
              <span className="hidden font-mono text-[0.66rem] text-mut sm:block">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-base font-medium tracking-tight text-ink transition-colors group-hover:text-brand sm:text-lg">
                {item.question}
              </span>
            </span>
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-mut transition-all group-open:rotate-45 group-open:border-brand group-open:bg-brand group-open:text-brandink">
              <Plus className="h-3.5 w-3.5" />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 text-sm leading-relaxed text-mut sm:pl-10 sm:text-[0.95rem]">
            {item.answer}
          </p>
        </details>
      ))}
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />;
}
