// Generates dist/sitemap.xml after `vite build`, wired up as the "postbuild"
// npm script. Runs in plain Node (fetch is built in on Node >= 18), so it
// needs no extra dependencies.
//
// Static routes are hardcoded below. Job URLs are pulled live from the API
// at build time, so the sitemap always reflects whatever is actually
// published — expired listings (deadline in the past) are excluded, since a
// sitemap advertising dead job pages hurts crawl trust rather than helping
// discovery. Re-run this (i.e. re-deploy) whenever jobs are added, edited or
// removed so the sitemap stays fresh — this is the main lever Google for
// Jobs uses to (re)index and de-index listings quickly.

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// Minimal .env loader so this works without adding the `dotenv` package.
// Vite already does this for the app itself; we just need the same two
// values here, in plain Node, outside Vite's pipeline.
async function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!existsSync(envPath)) return;
  const content = await readFile(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] === undefined) {
      process.env[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  }
}

await loadEnv();

const SITE_URL = (process.env.VITE_SITE_URL || "https://placero.in").replace(/\/$/, "");
const API_BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:4000";

const STATIC_ROUTES = [
  { path: "/", changefreq: "hourly", priority: "1.0" },
  { path: "/jobs", changefreq: "hourly", priority: "0.9" },
  { path: "/internships", changefreq: "hourly", priority: "0.8" },
  { path: "/freshers", changefreq: "hourly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.1" },
  { path: "/terms", changefreq: "yearly", priority: "0.1" },
];

function isExpired(job) {
  if (!job.deadline) return false;
  const d = new Date(job.deadline);
  return !Number.isNaN(d.getTime()) && d.getTime() < Date.now();
}

function toLastmod(value) {
  const d = value ? new Date(value) : new Date();
  return (Number.isNaN(d.getTime()) ? new Date() : d).toISOString().slice(0, 10);
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

async function fetchJobs() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/jobs`);
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[sitemap] Could not fetch jobs from ${API_BASE_URL}/api/jobs (${err.message}).`);
    console.warn("[sitemap] Writing a sitemap with static routes only.");
    return [];
  }
}

const jobs = await fetchJobs();
const activeJobs = jobs.filter((job) => !isExpired(job));

const urls = [
  ...STATIC_ROUTES.map((r) =>
    urlEntry({ loc: `${SITE_URL}${r.path}`, changefreq: r.changefreq, priority: r.priority, lastmod: toLastmod() })
  ),
  ...activeJobs.map((job) =>
    urlEntry({
      loc: `${SITE_URL}/jobs/${job.slug}`,
      lastmod: toLastmod(job.postedAt),
      changefreq: "daily",
      priority: "0.7",
    })
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

const outDir = path.join(ROOT, "dist");
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "sitemap.xml"), xml, "utf-8");

console.log(`[sitemap] Wrote dist/sitemap.xml with ${STATIC_ROUTES.length} static + ${activeJobs.length} job URLs.`);
