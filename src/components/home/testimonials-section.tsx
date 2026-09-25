import { Quote } from "lucide-react";
import type { Testimonial } from "@/db/schema";
import { Container, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion";

export default function TestimonialsSection({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null; // never show fake testimonials

  return (
    <section className="py-24 md:py-36" aria-labelledby="testimonials-h">
      <Container>
        <Reveal>
          <SectionHead
            index="09"
            kicker="Testimonials"
            title={<span id="testimonials-h">What clients say.</span>}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.09} className="h-full">
              <figure className="card-surface flex h-full flex-col p-7">
                <Quote className="h-5 w-5 text-brand" />
                <blockquote className="mt-5 flex-1 text-[0.95rem] leading-relaxed text-ink">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-5">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="mt-0.5 text-xs text-mut">
                    {[t.position, t.company].filter(Boolean).join(" · ")}
                  </p>
                  {t.project && <p className="mt-1 text-[0.7rem] text-brand">{t.project}</p>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
