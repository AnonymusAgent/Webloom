/** Production-mode HTTP/SEO checks. Run after `npm run start` with BASE_URL set. */
import assert from "node:assert/strict";

const base = process.env.BASE_URL || "http://localhost:3000";
const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://webloom-nu.vercel.app").replace(/\/$/, "");
const pages = [
  "/", "/about", "/services", "/work", "/pricing", "/contact", "/blog",
  "/work/bloom-pos", "/work/noor", "/work/pulse", "/work/clarity-health",
  "/legal/privacy", "/legal/terms", "/legal/cookies",
];
const titles = new Set();
for (const path of pages) {
  const res = await fetch(new URL(path, base));
  assert.equal(res.status, 200, `${path} should render`);
  const html = await res.text();
  assert.equal(
    (html.match(/https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-79N9P8BC14/g) || []).length,
    1,
    `${path} should include exactly one GA4 tag preload from the root layout`
  );
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `${path} needs a unique title`);
  titles.add(title);
  assert.match(html, /<h1(?:\s|>)/, `${path} needs an H1`);
  assert.match(html, /<meta name="description"/, `${path} needs a description`);
  assert.match(html, /<meta property="og:title"/, `${path} needs an OG title`);
  assert.match(html, /<meta name="twitter:title"/, `${path} needs a Twitter title`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical, site + (path === "/" ? "" : path), `${path} needs a canonical`);
  assert.equal(html.includes('name="robots" content="noindex'), path.startsWith("/legal/"), `${path} robots mismatch`);
  if (path === "/work" || path.startsWith("/work/")) {
    const slugs = path === "/work" ? ["bloom-pos", "noor", "pulse", "clarity-health"] : [path.split("/")[2]];
    for (const slug of slugs) {
      assert.ok(html.includes(encodeURIComponent(`/images/projects/${slug}-concept.jpg`)), `${path} should render ${slug} artwork`);
    }
  }
  for (const [name, href] of [
    ["Type Arena", "https://type-arena-silk.vercel.app/"],
    ["AR Manager", "https://ar-manager-ten.vercel.app/login"],
  ]) {
    assert.ok(html.includes(`href="${href}"`), `${path} footer should link to ${name} live site`);
  }
  if (path === "/") {
    assert.ok(!html.includes("<canvas") && !html.includes("hero-scene-fallback"), "Homepage should not render a 3D scene");
    assert.ok(html.includes('href="#services"') && html.includes('href="/pricing#faq"'), "Homepage section and FAQ links should work");
    assert.ok(html.includes('aria-label="Our workflow"') && html.includes('id="tech-h"'), "Homepage workflow and technology should render in initial HTML");
    for (const slug of ["bloom-pos", "noor", "pulse", "clarity-health"]) {
      assert.ok(html.includes(`href="/work/${slug}"`), `Homepage should link to ${slug}`);
    }
  }
  console.log(`${res.status} ${path}`);
}
const arArtwork = await fetch(new URL("/images/projects/ar-manager.svg", base));
assert.equal(arArtwork.status, 200, "Source-informed AR Manager artwork should be available");
assert.match(arArtwork.headers.get("content-type") || "", /image\/svg\+xml/);
assert.match(await arArtwork.text(), /NOT A LIVE SCREENSHOT/);
for (const name of ["type-arena", "la-maison-restaurant", "bloom-pos-concept", "noor-concept", "pulse-concept", "clarity-health-concept"]) {
  const artwork = await fetch(new URL(`/images/projects/${name}.jpg`, base));
  assert.equal(artwork.status, 200, `${name} portfolio artwork should be available`);
  assert.match(artwork.headers.get("content-type") || "", /image\/jpeg/);
}
for (const path of ["/not-a-page", "/work/not-a-project", "/blog/not-an-article"]) {
  const res = await fetch(new URL(path, base));
  assert.equal(res.status, 404, `${path} should be a 404`);
}
const sitemap = await fetch(new URL("/sitemap.xml", base));
assert.equal(sitemap.status, 200);
const xml = await sitemap.text();
for (const path of ["/work/bloom-pos", "/work/noor", "/work/pulse", "/work/clarity-health"]) {
  assert.ok(xml.includes(site + path), `Sitemap missing ${path}`);
}
assert.ok(!xml.includes("/legal/privacy"), "Unreviewed legal drafts should not be indexed");
const robots = await fetch(new URL("/robots.txt", base));
assert.equal(robots.status, 200);
assert.ok((await robots.text()).includes(site + "/sitemap.xml"));
for (const body of ["{bad", JSON.stringify({ name: "A" }), JSON.stringify({ website: "spam" })]) {
  const res = await fetch(new URL("/api/contact", base), {
    method: "POST", headers: { "Content-Type": "application/json" }, body,
  });
  assert.equal(res.status, 400, "Invalid / spam form should be rejected");
  assert.ok((await res.json()).error);
}
console.log(`Validated ${pages.length} pages, sitemap, robots, 404s and invalid contact requests.`);
