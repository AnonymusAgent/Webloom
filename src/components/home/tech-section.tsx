import { TECH } from "@/lib/site";
import { Container, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion";

/** Source-backed capabilities, without the old continuously animated radial map. */
export default function TechSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36" aria-labelledby="tech-h">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "var(--halo)" }} />
      <Container className="relative">
        <Reveal>
          <SectionHead
            index="06"
            kicker="Technology"
            title={<span id="tech-h">A modern, pragmatic stack.</span>}
            lead="We choose proven technology that fits the product — and only list what we actually build with."
          />
        </Reveal>
        <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {TECH.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={(index % 5) * 0.05} className="h-full">
                <div className="card-surface group flex h-full flex-col p-5 sm:p-6">
                  <span className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-elev/60 text-brand transition-colors group-hover:border-brand/40 sm:mb-10">
                    <item.icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-semibold tracking-tight sm:text-base">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-mut">{item.items.join(" · ")}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
