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
  console.log(`${res.status} ${path}`);
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
