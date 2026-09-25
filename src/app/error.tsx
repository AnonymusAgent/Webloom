"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Container, LogoMark } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // surface in the console; server-side errors are also captured in admin logs
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "var(--halo)" }} />
      <Container className="relative flex flex-col items-center">
        <LogoMark className="h-11 w-11 animate-spin-slower" />
        <p className="kicker mt-8">Something went wrong</p>
        <h1 className="mt-4 max-w-xl text-balance text-[clamp(1.9rem,4.5vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
          A petal fell off. We&apos;re putting it back.
        </h1>
        <p className="mt-5 max-w-md text-pretty leading-relaxed text-mut">
          An unexpected error occurred while rendering this page. You can try again — if it keeps
          happening, let us know and we&apos;ll fix it.
        </p>
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brandink transition-all hover:shadow-[0_8px_30px_-6px_var(--brand)]"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-line2 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
          >
            Back to Webloom
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 font-mono text-[0.66rem] text-mut">Error ref: {error.digest}</p>
        )}
      </Container>
    </section>
  );
}
