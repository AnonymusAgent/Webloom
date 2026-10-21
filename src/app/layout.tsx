import { jsonLd } from "@/lib/json-ld";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { SITE, SOCIALS } from "@/lib/site";
import Chrome from "@/components/chrome";
import "./globals.css";

// Self-hosted variable fonts: no build-time Google Fonts request or third-party font fetch.
const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const mono = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono-alt",
  weight: "100 800",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Web Development, Apps & Custom Software`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "web development company",
    "mobile app development",
    "custom software development",
    "SaaS development",
    "website development",
    "business software",
    "UI/UX design",
    "AI application development",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} | Web Development, Apps & Custom Software`,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Webloom — digital products, built beautifully" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Web Development, Apps & Custom Software`,
    description: SITE.description,
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07090a" },
    { media: "(prefers-color-scheme: light)", color: "#f7f7f1" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeScript = `(function(){try{var t=localStorage.getItem("wl-theme");if(t==="light"){document.documentElement.classList.remove("dark")}else{document.documentElement.classList.add("dark")}}catch(e){document.documentElement.classList.add("dark")}})();`;

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  slogan: SITE.positioning,
  description: SITE.description,
  email: SITE.email,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const settings = { contactEmail: SITE.email, socials: SOCIALS };
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd([orgSchema, websiteSchema]) }}
        />
      </head>
      <body className={`${inter.variable} ${mono.variable} font-sans`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brandink"
        >
          Skip to content
        </a>
        <Chrome settings={settings}>{children}</Chrome>
        {/* The Google tag loads after hydration; GA4 Enhanced Measurement handles history page views. */}
        <GoogleAnalytics gaId="G-79N9P8BC14" />
      </body>
    </html>
  );
}
