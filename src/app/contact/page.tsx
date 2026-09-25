import type { Metadata } from "next";
import { CalendarCheck, Mail, MessagesSquare, SearchCheck } from "lucide-react";
import ContactForm, { type ContactInitial } from "@/components/contact-form";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getPublicSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Let's build something worth building",
  description:
    "Tell Webloom about your project: websites, mobile apps, SaaS, custom software, AI products or improvements to an existing product. We reply within one business day.",
  alternates: { canonical: "/contact" },
};

const NEXT_STEPS = [
  {
    icon: MessagesSquare,
    title: "We read it properly",
    blurb: "Your brief is reviewed by someone who can actually answer — not a bot, not a sales script.",
  },
  {
    icon: Mail,
    title: "You hear back fast",
    blurb: "Usually within one business day, with real questions or a suggested call time.",
  },
  {
    icon: SearchCheck,
    title: "Discovery call",
    blurb: "A focused conversation about goals, scope, budget and timeline — no pressure.",
  },
  {
    icon: CalendarCheck,
    title: "Clear proposal",
    blurb: "You receive a written proposal with scope, price and timeline before any commitment.",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const settings = await getPublicSettings();

  const initial: ContactInitial = {};
  if (sp.type === "existing") {
    initial.projectType = "Existing Product Improvement";
    initial.message = "I already have a product and I'd like to improve it. Specifically: ";
  } else if (sp.type === "combination") {
    initial.projectType = "Other";
    initial.message = "I'm interested in a combination (e.g. website + mobile app + admin dashboard): ";
  } else if (sp.plan) {
    initial.message = `I'm interested in the "${sp.plan}" package. `;
  } else if (sp.service) {
    initial.message = `I'm interested in your "${sp.service}" service. `;
  } else if (sp.ref === "estimator") {
    initial.message = "I used your pricing estimator and my estimated range looked reasonable. Here's what I'm building: ";
  } else if (sp.ref) {
    initial.message = `I saw "${sp.ref}" in your work section and I'd like to build something similar. `;
  }

  return (
    <section className="relative overflow-hidden pt-40 pb-24 md:pt-52 md:pb-32">
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--halo)" }} />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="kicker mb-6 flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
                Contact
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="text-balance text-[clamp(2.4rem,5.5vw,4.4rem)] font-semibold leading-[1.03] tracking-[-0.03em]">
                Let&apos;s build something{" "}
                <span className="text-gradient-brand">worth building.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-mut">
                Tell us what you&apos;re making — a website, an app, a platform, or an existing
                product that needs to be better. The more context, the better the first reply.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <a
                href={`mailto:${settings.contactEmail}`}
                data-track="contact_email"
                className="mt-7 inline-flex items-center gap-2.5 text-sm font-medium text-ink underline decoration-brand/50 underline-offset-4 transition-colors hover:text-brand"
              >
                <Mail className="h-4 w-4 text-brand" />
                {settings.contactEmail}
              </a>
            </Reveal>

            <div className="mt-12 space-y-2">
              <p className="kicker mb-4 text-[0.64rem]">What happens next</p>
              {NEXT_STEPS.map((s, i) => (
                <Reveal key={s.title} delay={0.1 + i * 0.07} y={16}>
                  <div className="group flex items-start gap-4 rounded-2xl border border-transparent p-4 transition-all duration-300 hover:border-line hover:bg-card">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-brand">
                      <s.icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold tracking-tight">
                        <span className="mr-2 font-mono text-[0.66rem] text-brand">0{i + 1}</span>
                        {s.title}
                      </p>
                      <p className="mt-1 text-[0.8rem] leading-relaxed text-mut">{s.blurb}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2} className="lg:sticky lg:top-28 lg:self-start">
            <ContactForm initial={initial} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
