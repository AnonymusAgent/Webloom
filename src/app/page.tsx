import Hero from "@/components/home/hero";
import TrustStrip from "@/components/home/trust-strip";
import ServicesSection from "@/components/home/services-section";
import ProductsSection from "@/components/home/products-section";
import WhySection from "@/components/home/why-section";
import WorkPreview from "@/components/home/work-preview";
import GithubWorkPreview from "@/components/home/github-work-preview";
import ProcessSection from "@/components/home/process-section";
import TechSection from "@/components/home/tech-section";
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

export default async function Home() {
  const [faqs, testimonials, posts, githubProjects] = await Promise.all([
    getFaqs(),
    getTestimonials(),
    getPosts(),
    getGithubProjects(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <FaqJsonLd items={faqs} />
      <Hero />
      <TrustStrip />
      <ServicesSection />
      <ProductsSection />
      <WhySection />
      <GithubWorkPreview projects={githubProjects} />
      <WorkPreview />
      <ProcessSection />
      <TechSection />
      <PricingPreview />
      <ImproveSection />
      <TestimonialsSection items={testimonials} />
      <InsightsSection posts={posts.slice(0, 4)} />

      <section className="py-24 md:py-36" aria-labelledby="faq-h">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <SectionHead
                index="11"
                kicker="FAQ"
                title={<span id="faq-h">Questions, answered.</span>}
                lead="Everything most people want to know before starting a project with Webloom."
              />
            </Reveal>
            <Faq items={faqs} />
          </div>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
