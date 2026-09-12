#!/usr/bin/env node
/**
 * Generates public/sitemap.xml and public/robots.txt from the real route list,
 * including one entry per project case study. Runs before every build, so a new
 * project in portfolio.ts is indexed without anyone remembering to update XML.
 *
 * The host comes from SITE_URL (or VITE_SITE_URL). Without one, the script
 * writes a sitemap-less robots.txt rather than baking in a wrong domain.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || "").replace(/\/+$/, "");

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/projects", priority: "0.9", changefreq: "weekly" },
  { path: "/skills", priority: "0.8", changefreq: "monthly" },
  { path: "/experience", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "yearly" },
  { path: "/status", priority: "0.5", changefreq: "daily" },
  { path: "/explorer", priority: "0.5", changefreq: "monthly" },
];

/**
 * Pulls project ids straight out of the data file without compiling it.
 * Bounded to the `projects:` array so ids nested inside it (architecture nodes,
 * decision records) and the arrays that follow are not mistaken for projects.
 */
function projectIds() {
  const src = readFileSync(resolve(root, "src/data/portfolio.ts"), "utf8");
  const start = src.indexOf("\n  projects: [");
  const end = src.indexOf("\n  experience: [", start);
  if (start === -1) throw new Error("Could not locate the projects array in portfolio.ts");
  const block = src.slice(start, end === -1 ? undefined : end);
  return [...block.matchAll(/^ {6}id: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
}

const ids = projectIds();
const routes = [...STATIC_ROUTES, ...ids.map((id) => ({ path: `/projects/${id}`, priority: "0.7", changefreq: "monthly" }))];
const today = new Date().toISOString().slice(0, 10);

if (siteUrl) {
  const urls = routes
    .map(
      (r) =>
        `  <url>\n    <loc>${siteUrl}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
    )
    .join("\n");

  writeFileSync(
    resolve(root, "public/sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  writeFileSync(
    resolve(root, "public/robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  );
  console.log(`sitemap: ${routes.length} routes (${ids.length} case studies) at ${siteUrl}`);
} else {
  writeFileSync(
    resolve(root, "public/robots.txt"),
    `User-agent: *\nAllow: /\n\n# Set SITE_URL before building to emit a sitemap:\n#   SITE_URL=https://your-domain.com npm run build\n`,
  );
  console.log("sitemap: skipped — set SITE_URL to your deployed domain to generate it");
}
