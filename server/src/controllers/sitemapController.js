const { pool } = require("../db");
const { asyncHandler } = require("../utils/helpers");

const SITE_URL = process.env.PUBLIC_SITE_URL || "https://placero.in";
const STATIC_ROUTES = ["/", "/jobs", "/internships", "/freshers", "/about", "/privacy", "/terms"];

// GET /api/sitemap.xml
// Convenience endpoint the frontend's build-time script (or Vercel itself)
// can fetch to assemble sitemap.xml without a direct DB connection. Public,
// read-only, cacheable.
const getSitemap = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT slug, updated_at FROM jobs
     WHERE status = 'published' AND (deadline IS NULL OR deadline >= CURRENT_DATE)
     ORDER BY updated_at DESC`,
  );

  const urls = [
    ...STATIC_ROUTES.map((path) => ({ loc: `${SITE_URL}${path}`, lastmod: null })),
    ...rows.map((r) => ({ loc: `${SITE_URL}/jobs/${r.slug}`, lastmod: r.updated_at })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${new Date(u.lastmod).toISOString().slice(0, 10)}</lastmod>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`;

  res.set("Content-Type", "application/xml");
  res.set("Cache-Control", "public, max-age=300");
  res.send(xml);
});

module.exports = { getSitemap };
