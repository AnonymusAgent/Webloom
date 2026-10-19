import type { Metadata } from "next";
import { SITE } from "@/lib/site";

/** Keep social previews in sync with each route's visible title and description. */
export function pageSeo(title: string, description: string, canonical: string): Metadata {
  const socialTitle = `${title} · ${SITE.name}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      url: canonical,
      title: socialTitle,
      description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Webloom" }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/og-image.jpg"],
    },
  };
}
