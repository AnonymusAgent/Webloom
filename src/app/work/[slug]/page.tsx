import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { PRODUCTS } from "@/lib/site";
import { pageSeo } from "@/lib/seo";
import { Button, Container } from "@/components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((item) => item.slug === slug);
  if (!product) return { title: "Project not found", robots: { index: false } };
  return pageSeo(`${product.name} — ${product.category}`, product.blurb, `/work/${slug}`);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCTS.find((item) => item.slug === slug);
  if (!product) notFound();
  const isConcept = product.label === "Product Concept";

  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24" style={{ background: "var(--halo)" }}>
        <Container>
          <Link href="/work" className="inline-flex items-center gap-2 text-sm text-mut hover:text-brand">
            <ArrowLeft className="h-4 w-4" /> All work
          </Link>
          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="kicker">{product.label} / {product.category}</p>
              <h1 className="mt-5 text-balance text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.05] tracking-tight">
                {product.name}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-mut">{product.blurb}</p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-mut">
                {isConcept
                  ? "This is a product concept, not a client engagement or a launched product. Features below describe the proposed scope, not verified production results."
                  : "A Webloom product, not client work. This overview describes the product direction; no performance results or client outcomes are claimed."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={`/contact?ref=${product.slug}`}>Discuss a similar project</Button>
                <Button href="/services" variant="secondary">Explore our services</Button>
              </div>
            </div>
            <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-[2rem] border border-line bg-card sm:min-h-80" aria-hidden="true">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border border-line2 bg-elev shadow-soft">
                <product.icon className="h-14 w-14 text-brand" strokeWidth={1.4} />
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="kicker">The objective</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">A product shaped for its users.</h2>
            <p className="mt-5 leading-relaxed text-mut">{product.blurb}</p>
            {product.serves && <p className="mt-5 text-sm leading-relaxed text-mut"><span className="font-medium text-ink">Intended for: </span>{[...new Set(product.serves)].join(" · ")}</p>}
            <h2 className="mt-12 text-2xl font-semibold tracking-tight sm:text-3xl">{isConcept ? "Proposed approach" : "Product direction"}</h2>
            <p className="mt-5 leading-relaxed text-mut">{product.outcome}</p>
            <Link href="/services#software" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand">See our software services <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="rounded-3xl border border-line bg-card p-7 sm:p-9">
            <p className="kicker">{isConcept ? "Proposed features" : "Product features"}</p>
            <ul className="mt-7 grid gap-4 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {feature}
                </li>
              ))}
            </ul>
            <div className="mt-9 border-t border-line pt-8">
              <p className="kicker">{isConcept ? "Proposed technology" : "Technology profile"}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {product.tech.map((tech) => <li key={tech} className="rounded-full border border-line px-3 py-1.5 text-xs text-mut">{tech}</li>)}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
