import {
  Atom,
  Boxes,
  BrainCircuit,
  Cloud,
  Compass,
  Cpu,
  CreditCard,
  Database,
  Fingerprint,
  Gauge,
  GitBranch,
  Globe,
  Layers,
  Moon,
  PenTool,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Stethoscope,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export const SITE = {
  name: "Webloom",
  tagline: "Digital products, built beautifully.",
  positioning: "We build digital products that make businesses grow.",
  email: "hello@webloom.dev",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description:
    "Webloom is a premium software and digital product company. We design and engineer websites, mobile apps, SaaS platforms and custom business software — beautifully.",
};

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const HERO = {
  headline: "We build digital experiences that move businesses forward.",
  sub: "Webloom creates premium websites, mobile apps, SaaS platforms and custom software designed around the way your business actually works.",
  primary: { label: "Start a Project", href: "/contact" },
  secondary: { label: "Explore Our Work", href: "/work" },
};

export const TRUST_FLOW = ["Idea", "Design", "Development", "Launch", "Growth"];

export const CATEGORIES = [
  "Web",
  "Mobile",
  "SaaS",
  "Business Software",
  "AI",
  "E-commerce",
  "UI/UX",
  "Custom Platforms",
];

/* ---------------------------------- types --------------------------------- */

export type Service = {
  slug: string;
  title: string;
  tag: string;
  blurb: string;
  features: string[];
  icon: LucideIcon;
};

export type Product = {
  slug: string;
  label: "Webloom Product" | "Product Concept";
  name: string;
  category: string;
  blurb: string;
  features: string[];
  serves?: string[];
  tech: string[];
  outcome: string;
  icon: LucideIcon;
  hue: string; // accent tint used for card art
};

export type Tier = {
  name: string;
  price: string;
  suffix?: string;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

/* -------------------------------- services -------------------------------- */

export const SERVICES: Service[] = [
  {
    slug: "web",
    title: "Website Development",
    tag: "Web",
    blurb: "Fast, responsive, conversion-focused websites engineered to represent your business properly.",
    features: [
      "Business & corporate websites",
      "Landing pages",
      "E-commerce",
      "Web applications",
      "Booking platforms",
      "Customer portals",
      "Admin dashboards",
    ],
    icon: Globe,
  },
  {
    slug: "mobile",
    title: "Mobile App Development",
    tag: "Mobile",
    blurb: "Modern Android and iOS applications with native-quality feel and reliable engineering.",
    features: [
      "Native-quality experiences",
      "Cross-platform development",
      "Authentication",
      "Payments",
      "Push notifications",
      "Offline functionality",
      "Cloud synchronization",
      "Store submission preparation",
    ],
    icon: Smartphone,
  },
  {
    slug: "software",
    title: "Custom Software",
    tag: "Software",
    blurb: "Software shaped around your workflow — not the other way around.",
    features: [
      "POS systems",
      "Inventory & stock management",
      "Billing systems",
      "CRM",
      "Medical billing",
      "Booking systems",
      "Business management",
      "Reporting platforms",
    ],
    icon: Boxes,
  },
  {
    slug: "saas",
    title: "SaaS Development",
    tag: "SaaS",
    blurb: "Scalable subscription products with solid multi-tenant architecture from day one.",
    features: [
      "User accounts",
      "Subscription plans",
      "Payment integration",
      "Admin panels",
      "Analytics",
      "Cloud infrastructure",
      "Security",
      "Multi-tenant architecture",
    ],
    icon: Cloud,
  },
  {
    slug: "ai",
    title: "AI-Powered Products",
    tag: "AI",
    blurb: "Practical AI that does real work — woven into products people actually use.",
    features: [
      "AI assistants",
      "AI automation",
      "AI content tools",
      "AI search",
      "AI document processing",
      "AI-powered business workflows",
    ],
    icon: BrainCircuit,
  },
  {
    slug: "design",
    title: "UI/UX Design",
    tag: "Design",
    blurb: "Premium digital experiences designed before a single line of code is written.",
    features: [
      "UX research",
      "User flows",
      "Wireframes",
      "UI design",
      "Design systems",
      "Prototypes",
      "Responsive design",
    ],
    icon: PenTool,
  },
];

/* -------------------------------- products -------------------------------- */

export const PRODUCTS: Product[] = [
  {
    slug: "bloom-pos",
    label: "Webloom Product",
    name: "BloomPOS",
    category: "Business POS & Inventory Platform",
    blurb:
      "A complete platform for sales, inventory and business insight — designed for the realities of retail and service businesses.",
    features: [
      "Inventory",
      "Sales",
      "Purchases",
      "Expenses",
      "Invoices",
      "Stock",
      "Reports",
      "Business analytics",
    ],
    serves: [
      "Marts",
      "Cash & Carry",
      "Restaurants",
      "Fast food",
      "Medical stores",
      "Garments",
      "Cosmetics",
      "Salons",
      "Auto parts",
      "Book shops",
      "Shoe stores",
      "Stationery",
    ],
    tech: ["Next.js", "PostgreSQL", "Offline sync", "Thermal printing"],
    outcome: "One system replacing spreadsheets, paper invoices and guesswork.",
    icon: ShoppingCart,
    hue: "160deg",
  },
  {
    slug: "noor",
    label: "Webloom Product",
    name: "Noor",
    category: "Quran & Islamic Learning Platform",
    blurb:
      "A content-rich mobile platform for reading, listening and learning — built with deep respect for the material and its readers.",
    features: [
      "Complete Quran with Surahs",
      "Recitation by multiple reciters",
      "Translation",
      "Tafsir",
      "Hadith",
      "Duas",
      "Salah tools",
      "Offline downloads",
      "Kids Mode",
      "Source references",
    ],
    tech: ["React Native", "Audio streaming", "Offline-first", "RTL design"],
    outcome: "A calm, reliable companion app for daily reading and learning.",
    icon: Moon,
    hue: "200deg",
  },
  {
    slug: "pulse",
    label: "Product Concept",
    name: "Pulse",
    category: "Hardware Diagnostic Platform",
    blurb:
      "A product concept for deep hardware insight — detection, monitoring and stress testing in one polished desktop experience.",
    features: [
      "Hardware detection",
      "Device information",
      "Sensor monitoring",
      "Performance monitoring",
      "Stress testing",
      "Premium features",
    ],
    tech: ["Desktop app", "System APIs", "Real-time charts"],
    outcome: "Technician-grade diagnostics wrapped in an interface anyone can read.",
    icon: Cpu,
    hue: "45deg",
  },
  {
    slug: "clarity-health",
    label: "Product Concept",
    name: "Clarity Health",
    category: "Medical Billing Platform",
    blurb:
      "A sophisticated business software concept covering the full financial workflow of a modern practice.",
    features: [
      "Patient management",
      "Billing",
      "Claims",
      "Reports",
      "Payments",
      "Administrative workflows",
    ],
    tech: ["Web platform", "PostgreSQL", "Role-based access", "Audit trails"],
    outcome: "Less time on paperwork, more time on patients.",
    icon: Stethoscope,
    hue: "280deg",
  },
];

export const IMPROVE = {
  title: "Already have a product? Make it better.",
  blurb: "Webloom works with existing websites, apps and software — not just new builds.",
  items: [
    "Website redesign",
    "Mobile app redesign",
    "Bug fixing",
    "Performance optimization",
    "UI/UX improvement",
    "Feature development",
    "Backend improvements",
    "Security improvements",
    "Offline functionality",
    "Payment integration",
    "Cloud backup",
    "Analytics",
    "Admin dashboards",
    "App modernization",
  ],
  cta: "Improve My Product",
};

/* ----------------------------------- why ---------------------------------- */

export const WHY = [
  {
    title: "Strategy First",
    blurb: "We understand the business problem before building the technology.",
    icon: Compass,
  },
  {
    title: "Designed for Humans",
    blurb: "Interfaces stay simple even when the underlying technology is complex.",
    icon: Users,
  },
  {
    title: "Built to Scale",
    blurb: "Architecture that supports the business as it grows, not just at launch.",
    icon: GitBranch,
  },
  {
    title: "Performance Obsessed",
    blurb: "Fast loading, responsive interfaces and carefully optimized experiences.",
    icon: Gauge,
  },
  {
    title: "Security Minded",
    blurb: "Secure authentication, data protection and sound security practices.",
    icon: ShieldCheck,
  },
  {
    title: "One Partner",
    blurb: "Strategy, UX, development, testing and launch — under one roof.",
    icon: Layers,
  },
];

/* --------------------------------- process -------------------------------- */

export const PROCESS = [
  {
    n: "01",
    title: "Discover",
    blurb: "Understand the business, audience, requirements and objectives.",
  },
  {
    n: "02",
    title: "Strategy",
    blurb: "Define product architecture, features, technology and roadmap.",
  },
  {
    n: "03",
    title: "Design",
    blurb: "Create the complete UX/UI system and interactive prototype.",
  },
  {
    n: "04",
    title: "Build",
    blurb: "Develop the website, application or software platform.",
  },
  {
    n: "05",
    title: "Test",
    blurb: "Functional, responsive, performance and usability testing.",
  },
  {
    n: "06",
    title: "Launch",
    blurb: "Deploy and prepare the product for real users.",
  },
  {
    n: "07",
    title: "Grow",
    blurb: "Continue improving, maintaining and scaling the product.",
  },
];

/* ----------------------------------- tech --------------------------------- */

export const TECH: { title: string; icon: LucideIcon; items: string[] }[] = [
  { title: "Web", icon: Globe, items: ["React", "Next.js", "TypeScript"] },
  { title: "Mobile", icon: Smartphone, items: ["React Native", "Expo"] },
  { title: "Cloud", icon: Cloud, items: ["Vercel", "AWS"] },
  { title: "Database", icon: Database, items: ["PostgreSQL", "Redis"] },
  { title: "Payments", icon: CreditCard, items: ["Stripe", "Local gateways"] },
  { title: "Analytics", icon: Gauge, items: ["Product analytics", "Dashboards"] },
  { title: "AI", icon: Sparkles, items: ["LLM APIs", "Embeddings", "RAG"] },
  { title: "Authentication", icon: Fingerprint, items: ["OAuth", "Sessions", "2FA"] },
  { title: "APIs", icon: Workflow, items: ["REST", "Webhooks", "Realtime"] },
  { title: "Infrastructure", icon: Atom, items: ["CI/CD", "Monitoring"] },
];

/* --------------------------------- pricing -------------------------------- */

export const PRICING: Record<string, { label: string; tiers: Tier[] }> = {
  websites: {
    label: "Websites",
    tiers: [
      {
        name: "Starter Website",
        price: "$299",
        blurb: "For individuals and small businesses getting online properly.",
        features: [
          "Up to 5 pages",
          "Responsive design",
          "Modern UI",
          "Contact form",
          "Basic SEO",
          "Social media integration",
          "Performance optimization",
          "Basic animations",
          "Deployment assistance",
        ],
        cta: "Get Started",
      },
      {
        name: "Business Website",
        price: "$599",
        blurb: "For businesses that need a stronger online presence.",
        features: [
          "Up to 10 pages",
          "Premium UI/UX",
          "Custom design",
          "Advanced animations",
          "SEO setup",
          "Contact / lead forms",
          "CMS integration",
          "Analytics",
          "Performance optimization",
          "Deployment",
          "Basic maintenance period",
        ],
        cta: "Choose Business",
        featured: true,
      },
      {
        name: "Premium Website",
        price: "$1,199",
        blurb: "For companies that want a high-end digital presence.",
        features: [
          "Fully custom design",
          "Advanced UI/UX",
          "Premium animations",
          "3D elements where appropriate",
          "Advanced interactions",
          "CMS",
          "Advanced SEO",
          "Analytics",
          "Conversion optimization",
          "Custom integrations",
          "Post-launch support",
        ],
        cta: "Build Premium",
      },
    ],
  },
  apps: {
    label: "Mobile Apps",
    tiers: [
      {
        name: "App Starter",
        price: "$999",
        blurb: "A focused first release of your mobile product.",
        features: [
          "Android / iOS app",
          "Modern UI",
          "Authentication",
          "Core functionality",
          "API integration",
          "Basic backend",
          "Testing",
          "Deployment guidance",
        ],
        cta: "Start My App",
      },
      {
        name: "Business App",
        price: "$2,499",
        blurb: "A complete product for both stores with a real backend.",
        features: [
          "Android + iOS",
          "Custom UI/UX",
          "Backend",
          "User accounts",
          "Push notifications",
          "API integrations",
          "Cloud database",
          "Admin dashboard",
          "Analytics",
          "Testing",
          "Deployment support",
        ],
        cta: "Choose Business",
        featured: true,
      },
      {
        name: "Advanced App",
        price: "$4,999+",
        blurb: "For complex products with serious requirements.",
        features: [
          "Android + iOS",
          "Advanced backend",
          "Cloud architecture",
          "Real-time functionality",
          "Payments & subscriptions",
          "Advanced admin dashboard",
          "Offline functionality",
          "Advanced security",
          "Third-party integrations",
          "Scalable architecture",
          "Store deployment support",
        ],
        cta: "Build Advanced",
      },
    ],
  },
  software: {
    label: "Custom Software",
    tiers: [
      {
        name: "Custom Software",
        price: "$2,500+",
        blurb:
          "Complex software is scoped individually. Every project starts with a discovery conversation and a tailored proposal.",
        features: [
          "POS systems",
          "Inventory & stock",
          "CRM / ERP",
          "Medical billing",
          "Booking platforms",
          "Business automation",
          "Internal company systems",
          "Reporting platforms",
        ],
        cta: "Discuss Your Software",
        featured: true,
      },
    ],
  },
  saas: {
    label: "SaaS",
    tiers: [
      {
        name: "SaaS MVP",
        price: "$3,500+",
        blurb: "Validate the idea with a focused first version.",
        features: [
          "User accounts",
          "Core feature set",
          "Subscription billing",
          "Basic admin panel",
          "Cloud deployment",
          "Analytics foundation",
        ],
        cta: "Plan My MVP",
      },
      {
        name: "SaaS Platform",
        price: "$7,500+",
        blurb: "A production-grade platform built to grow.",
        features: [
          "Multi-tenant architecture",
          "Subscription plans & tiers",
          "Advanced admin dashboard",
          "Full analytics",
          "Integrations & API",
          "Security hardening",
          "Scalable infrastructure",
        ],
        cta: "Scope My Platform",
        featured: true,
      },
    ],
  },
};

/* -------------------------------- estimator ------------------------------- */

export const ESTIMATOR = {
  types: [
    { id: "website", label: "Website", base: 400, perFeature: 90 },
    { id: "app", label: "Mobile App", base: 1200, perFeature: 160 },
    { id: "software", label: "Custom Software", base: 2500, perFeature: 220 },
    { id: "saas", label: "SaaS Platform", base: 3500, perFeature: 260 },
  ],
  options: [
    { id: "backend", label: "Do you need a backend?", add: 800 },
    { id: "admin", label: "Do you need an admin dashboard?", add: 600 },
    { id: "payments", label: "Do you need payments?", add: 500 },
    { id: "ai", label: "Do you need AI features?", add: 1200 },
  ],
  timeframes: [
    { id: "asap", label: "ASAP", mult: 1.25 },
    { id: "1-2", label: "1–2 months", mult: 1.1 },
    { id: "3-6", label: "3–6 months", mult: 1 },
    { id: "flex", label: "Flexible", mult: 0.95 },
  ],
};

/* ----------------------------------- faq ----------------------------------- */

export const FAQS = [
  {
    q: "How much does a website cost?",
    a: "Website packages start from $299 for a starter site, $599 for a business website and $1,199 for a premium build. Final pricing depends on pages, features, integrations and content — you'll always receive a clear proposal before we begin.",
  },
  {
    q: "How much does a mobile app cost?",
    a: "Apps start from around $999 for a focused single release, with business apps from $2,499 and advanced products from $4,999+. Complexity, backend requirements and integrations define the final scope.",
  },
  {
    q: "Can you build both Android and iOS?",
    a: "Yes. We use modern cross-platform technology to ship one codebase to both the Play Store and the App Store, with native-quality performance and feel.",
  },
  {
    q: "Can you build custom business software?",
    a: "Yes — POS, inventory, billing, CRM, medical billing, booking and reporting systems are a core part of what Webloom builds. Custom software starts from $2,500+ and is scoped through a discovery conversation.",
  },
  {
    q: "Do you provide backend development?",
    a: "Yes. APIs, databases, authentication, cloud infrastructure and admin panels are all handled in-house as part of the product build.",
  },
  {
    q: "Can you integrate payment systems?",
    a: "Yes. We integrate providers such as Stripe as well as regional payment gateways, including subscription billing and invoicing flows.",
  },
  {
    q: "Can you build subscription apps?",
    a: "Yes. Subscription plans, trials, upgrades, downgrades and billing management are standard parts of our SaaS and app work.",
  },
  {
    q: "Do you provide maintenance?",
    a: "Yes. Post-launch support and maintenance arrangements are available for every product we ship, tailored to how hands-on you want us to be.",
  },
  {
    q: "Can you redesign an existing website?",
    a: "Absolutely. We modernize existing sites — visually and technically — while preserving your content, SEO value and integrations.",
  },
  {
    q: "Can you improve an existing mobile app?",
    a: "Yes. We take over existing codebases to fix bugs, improve performance, refresh the UI/UX and build new features.",
  },
  {
    q: "How long does development take?",
    a: "Starter websites typically take 2–4 weeks, business websites 4–8 weeks, and apps or custom software are scheduled per scope. You'll get a realistic timeline with your proposal.",
  },
  {
    q: "Can you build an MVP first?",
    a: "Yes — we often recommend it. A focused MVP validates the idea with real users before investing in the full product.",
  },
  {
    q: "Do you provide deployment support?",
    a: "Yes. We handle deployment and store submission, and we make sure you understand how everything is hosted and operated.",
  },
  {
    q: "Can you scale an existing application?",
    a: "Yes. We audit the current architecture, remove bottlenecks and evolve the system so it can grow with your business.",
  },
];

/* ---------------------------------- legal ---------------------------------- */

export const LEGAL: Record<
  string,
  { title: string; intro: string; sections: { h: string; p: string }[] }
> = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "This policy explains what information Webloom collects and how it is used. It is a starting template and should be reviewed by a qualified legal professional before reliance.",
    sections: [
      {
        h: "What we collect",
        p: "Information you submit through forms (such as your name, email, company and project details) and privacy-conscious, aggregate analytics such as page views. We do not use invasive fingerprinting or sell personal data.",
      },
      {
        h: "How we use it",
        p: "We use submitted information to respond to enquiries, prepare proposals and deliver services. Analytics are used to understand how the site is used and to improve it.",
      },
      {
        h: "Storage & security",
        p: "Data is stored in secured systems with access limited to people who need it to operate the business. Administrative areas of this site are protected by authentication.",
      },
      {
        h: "Your choices",
        p: "You may request access to, correction of, or deletion of your personal information at any time by contacting us.",
      },
      {
        h: "Contact",
        p: "Questions about this policy can be sent to the contact address listed on our contact page.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    intro:
      "These terms govern use of the Webloom website. They are a starting template and should be reviewed by a qualified legal professional before reliance.",
    sections: [
      {
        h: "The website",
        p: "Content on this site is provided for general information about Webloom's services. Packages shown are starting estimates, not binding quotations; every engagement is defined by its own written proposal and agreement.",
      },
      {
        h: "Intellectual property",
        p: "The Webloom name, brand and site design are the property of Webloom. Product concepts shown are illustrative of our capabilities unless stated otherwise.",
      },
      {
        h: "No warranty",
        p: "The site is provided “as is” without warranties of any kind. Nothing on this site constitutes professional, legal or financial advice.",
      },
      {
        h: "Limitation of liability",
        p: "To the maximum extent permitted by law, Webloom is not liable for damages arising from use of this website.",
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    intro:
      "This policy explains how this site uses cookies and similar technologies. It is a starting template and should be reviewed by a qualified legal professional before reliance.",
    sections: [
      {
        h: "What we use",
        p: "A small number of cookies/local storage entries keep the site working: your theme preference, and a secure session cookie for the administrative dashboard.",
      },
      {
        h: "Analytics",
        p: "If analytics are enabled, page views are recorded in an aggregate, privacy-conscious way. We do not store IP addresses or use cross-site tracking cookies.",
      },
      {
        h: "Managing cookies",
        p: "You can clear or block cookies in your browser settings. The public site works without optional cookies; the admin dashboard requires its session cookie.",
      },
    ],
  },
};

/* --------------------------------- contact --------------------------------- */

export const PROJECT_TYPES = [
  "Website",
  "Mobile App",
  "SaaS",
  "Custom Software",
  "AI Product",
  "UI/UX",
  "Existing Product Improvement",
  "Other",
];

export const BUDGETS = [
  "Under $500",
  "$500–$1,000",
  "$1,000–$2,500",
  "$2,500–$5,000",
  "$5,000+",
  "Not sure",
];

export const TIMELINES = ["ASAP", "1–2 months", "3–6 months", "Flexible"];

export const LEAD_STATUSES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal Sent" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
] as const;

export const POST_CATEGORIES = [
  "Web Development",
  "Mobile Apps",
  "SaaS",
  "AI",
  "Business Software",
  "UI/UX",
  "Technology",
  "Product Development",
];

export const SOCIALS: { label: string; href: string }[] = [
  // Confirmed owner profile. Add only real Webloom-owned accounts.
  { label: "GitHub", href: "https://github.com/AnonymusAgent" },
];
