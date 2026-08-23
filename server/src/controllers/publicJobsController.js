const { pool } = require("../db");
const { asyncHandler, rowToJob } = require("../utils/helpers");

// GET /api/jobs
// Published, non-expired jobs only — this is what src/lib/api.js and the
// Vercel build-time static generator both call. No auth required, but it's
// read-only and never touches admin data.
const listPublicJobs = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM jobs
     WHERE status = 'published' AND (deadline IS NULL OR deadline >= CURRENT_DATE)
     ORDER BY featured DESC, posted_at DESC NULLS LAST, created_at DESC`,
  );
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.json(rows.map(rowToJob));
});

// GET /api/jobs/:slug
// Serves published jobs normally. Also serves expired jobs (so the URL
// doesn't 404 outright) but the frontend is expected to show related jobs
// rather than treat it as a live listing — draft/archived jobs are never
// exposed here.
const getPublicJobBySlug = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM jobs WHERE slug = $1 AND status IN ('published', 'expired')`,
    [req.params.slug],
  );
  if (!rows[0]) return res.status(404).json({ message: "Job not found" });
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.json(rowToJob(rows[0]));
});

module.exports = { listPublicJobs, getPublicJobBySlug };
