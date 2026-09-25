import type { Metadata } from "next";
import { Container, Button, LogoMark } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* bloom backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[340, 520, 720].map((s, i) => (
          <span
            key={s}
            className="absolute rounded-full border border-line"
            style={{
              width: s,
              height: s,
              opacity: 0.85 - i * 0.25,
              animation: `floaty ${7 + i * 1.3}s ease-in-out ${i * 0.6}s infinite`,
            }}
          />
        ))}
        <span
          className="absolute h-[380px] w-[380px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand) 14%, transparent), transparent 65%)",
          }}
        />
      </div>

      <Container className="relative flex flex-col items-center">
        <LogoMark className="h-12 w-12 animate-spin-slower" />
        <p className="kicker mt-8">404</p>
        <h1 className="mt-4 max-w-xl text-balance text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.06] tracking-[-0.02em]">
          Looks like this page hasn&apos;t bloomed yet.
        </h1>
        <p className="mt-5 max-w-md text-pretty leading-relaxed text-mut">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back
          somewhere useful.
        </p>
        <div className="mt-9">
          <Button href="/" size="lg" track="404_home">
            Back to Webloom
          </Button>
        </div>
      </Container>
    </section>
  );
}
