import Link from "next/link";
import { Container, LogoMark } from "@/components/ui";
import type { SiteSettings } from "@/lib/data";

function SocialIcon({ label, className }: { label: string; className?: string }) {
  const paths: Record<string, string> = {
    GitHub:
      "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.35-3.87-1.35-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.11-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.67.41.35.77 1.05.77 2.13v3.16c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z",
    Instagram:
      "M12 2.2c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85C2.42 3.92 3.94 2.38 7.15 2.27 8.42 2.21 8.8 2.2 12 2.2Zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4Zm0 8.57a3.37 3.37 0 1 1 0-6.74 3.37 3.37 0 0 1 0 6.74Zm5.4-8.78a1.21 1.21 0 1 0 0-2.42 1.21 1.21 0 0 0 0 2.42Z",
    Facebook: "M14 8.5V6.8c0-.8.2-1.3 1.4-1.3h1.6V2.5h-2.6C11.2 2.5 10 4.6 10 7v1.5H8v3h2v10h4v-10h2.5l.5-3H14Z",
    LinkedIn:
      "M4.98 3.5A2.49 2.49 0 1 1 5 8.48a2.49 2.49 0 0 1-.02-4.98ZM3 9.75h4V21.5H3V9.75Zm6.5 0H13v1.6h.05c.49-.93 1.7-1.9 3.5-1.9 3.74 0 4.43 2.46 4.43 5.66v6.39h-4v-5.66c0-1.35-.03-3.09-1.88-3.09-1.89 0-2.18 1.47-2.18 2.99v5.76h-4V9.75Z",
    X: "M3 3l7.1 9.5L3.4 21h2.3l5.6-7.1L15.8 21H21l-7.4-9.9L20.3 3h-2.3l-5 6.4L9.2 3H3Z",
  };
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={paths[label] ?? paths.GitHub} fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

const COMPANY = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const SERVICES_LINKS = [
  { label: "Websites", href: "/services#web" },
  { label: "Mobile Apps", href: "/services#mobile" },
  { label: "Custom Software", href: "/services#software" },
  { label: "SaaS", href: "/services#saas" },
  { label: "AI", href: "/services#ai" },
  { label: "UI/UX", href: "/services#design" },
];

const RESOURCES = [
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/pricing#faq" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookies" },
];



export default function Footer({ settings }: { settings: SiteSettings }) {
  const socials = settings.socials.filter((s) => s.href && s.href !== "#");

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{ background: "var(--halo)" }}
      />
      <Container className="relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Webloom home">
              <LogoMark className="h-7 w-7 transition-transform duration-700 group-hover:rotate-[120deg]" />
              <span className="text-xl font-semibold tracking-tight">Webloom</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mut">
              Digital products, built beautifully. We design and engineer websites, apps, SaaS
              platforms and custom software.
            </p>
            <a
              href={`mailto:${settings.contactEmail}`}
              data-track="footer_email"
              className="mt-5 inline-block text-sm font-medium text-ink underline decoration-brand/50 underline-offset-4 transition-colors hover:text-brand"
            >
              {settings.contactEmail}
            </a>
            {socials.length > 0 && (
              <div className="mt-6 flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-mut transition-all hover:border-line2 hover:text-ink"
                  >
                    <SocialIcon label={s.label} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {[
            { title: "Company", links: COMPANY },
            { title: "Services", links: SERVICES_LINKS },
            { title: "Resources", links: RESOURCES },
            { title: "Legal", links: LEGAL_LINKS },
          ].map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="kicker mb-5 text-[0.66rem]">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-mut transition-colors duration-200 hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-mut">
            © {new Date().getFullYear()} Webloom. All rights reserved.
          </p>
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-mut uppercase">
            Idea → Design → Build → Launch → Grow
          </p>
        </div>
      </Container>
    </footer>
  );
}
