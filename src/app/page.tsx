import { jsonLd } from "@/lib/json-ld";
import Link from "next/link";
import { Suspense } from "react";
import Hero from "@/components/home/hero";
import ServicesSection from "@/components/home/services-section";
import WhySection from "@/components/home/why-section";
import WorkPreview from "@/components/home/work-preview";
import GithubWorkPreview from "@/components/home/github-work-preview";
import ProcessSection from "@/components/home/process-section";
import PricingPreview from "@/components/home/pricing-preview";
import ImproveSection from "@/components/improve-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import InsightsSection from "@/components/home/insights-section";
import FinalCta from "@/components/home/final-cta";
import Faq, { FaqJsonLd } from "@/components/faq";
import { Container, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getFaqs, getGithubProjects, getPosts, getTestimonials } from "@/lib/data";
import { SITE } from "@/lib/site";

export const revalidate = 300;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
};

async function VerifiedWork() {
  return <GithubWorkPreview projects={await getGithubProjects()} />;
}

async function PublishedContent() {
  const [testimonials, posts] = await Promise.all([getTestimonials(), getPosts()]);
  return (
    <>
      <TestimonialsSection items={testimonials} />
      <InsightsSection posts={posts.slice(0, 4)} />
    </>
  );
}

async function Questions() {
  const featuredFaqs = (await getFaqs()).slice(0, 6);
  return (
    <>
      <FaqJsonLd items={featuredFaqs} />
      <section className="py-24 md:py-36" aria-labelledby="faq-h">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <SectionHead
                index="09"
                kicker="FAQ"
                title={<span id="faq-h">Questions, answered.</span>}
                lead="Everything most people want to know before starting a project with Webloom."
              />
            </Reveal>
            <div>
              <Faq items={featuredFaqs} />
              <Link href="/pricing#faq" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-brand hover:underline">
                More questions about pricing and projects →
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }}
      />
      <Hero />
      <ServicesSection />
      <WhySection />
      <Suspense fallback={null}><VerifiedWork /></Suspense>
      <WorkPreview />
      <ProcessSection />
      <PricingPreview />
      <ImproveSection />
      <Suspense fallback={null}><PublishedContent /></Suspense>
      <Suspense fallback={null}><Questions /></Suspense>

      <FinalCta />
    </>
  );
}
