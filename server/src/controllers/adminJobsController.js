const { pool } = require("../db");
const {
  asyncHandler,
  rowToJob,
  jobPayloadToColumns,
} = require("../utils/helpers");
const { buildUniqueSlug } = require("../utils/slugify");
const { triggerRebuild } = require("../utils/triggerRebuild");

async function slugExists(slug, excludeId) {
  const { rows } = await pool.query(
    excludeId
      ? "SELECT 1 FROM jobs WHERE slug = $1 AND id <> $2"
      : "SELECT 1 FROM jobs WHERE slug = $1",
    excludeId ? [slug, excludeId] : [slug],
  );
  return rows.length > 0;
}

// GET /api/admin/jobs?status=&category=&search=
const listJobs = asyncHandler(async (req, res) => {
  const { status, category, search } = req.query;
  const clauses = [];
  const params = [];

  if (status) {
    params.push(status);
    clauses.push(`status = $${params.length}`);
  }
  if (category) {
    params.push(category);
    clauses.push(`category = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    clauses.push(
      `(title ILIKE $${params.length} OR company ILIKE $${params.length})`,
    );
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const { rows } = await pool.query(
    `SELECT * FROM jobs ${where} ORDER BY created_at DESC`,
    params,
  );
  res.json(rows.map(rowToJob));
});

// GET /api/admin/jobs/:id
const getJob = asyncHandler(async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM jobs WHERE id = $1", [
    req.params.id,
  ]);
  if (!rows[0]) return res.status(404).json({ message: "Job not found" });
  res.json(rowToJob(rows[0]));
});

// POST /api/admin/jobs
const createJob = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  if (!payload.title || !payload.company) {
    return res.status(400).json({ message: "Company and title are required" });
  }

  const slug = payload.slug
    ? payload.slug
    : await buildUniqueSlug({
        title: payload.title,
        company: payload.company,
        checkExists: (s) => slugExists(s),
      });

  const columns = jobPayloadToColumns(payload);
  columns.slug = slug;
  columns.company = payload.company;
  columns.title = payload.title;
  if (columns.status === undefined) columns.status = "draft";
  if (columns.featured === undefined) columns.featured = false;

  const keys = Object.keys(columns);
  const values = Object.values(columns);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

  const { rows } = await pool.query(
    `INSERT INTO jobs (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`,
    values,
  );

  if (columns.status === "published") await triggerRebuild();
  res.status(201).json(rowToJob(rows[0]));
});

// PUT /api/admin/jobs/:id
const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body || {};

  const existing = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);
  if (!existing.rows[0])
    return res.status(404).json({ message: "Job not found" });

  const columns = jobPayloadToColumns(payload);

  // Only regenerate the slug if the admin explicitly asked to, or never set one.
  if (payload.slug) {
    columns.slug = payload.slug;
  } else if (payload.regenerateSlug && (payload.title || payload.company)) {
    columns.slug = await buildUniqueSlug({
      title: payload.title || existing.rows[0].title,
      company: payload.company || existing.rows[0].company,
      checkExists: (s) => slugExists(s, id),
    });
  }

  const keys = Object.keys(columns);
  if (keys.length === 0) return res.json(rowToJob(existing.rows[0]));

  const values = Object.values(columns);
  const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const { rows } = await pool.query(
    `UPDATE jobs SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id],
  );

  await triggerRebuild(); // an edit to any already-published job needs to reach the public site too
  res.json(rowToJob(rows[0]));
});

// DELETE /api/admin/jobs/:id
const deleteJob = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    "DELETE FROM jobs WHERE id = $1 RETURNING id, status",
    [req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ message: "Job not found" });
  if (rows[0].status === "published") await triggerRebuild();
  res.status(204).end();
});

// POST /api/admin/jobs/:id/publish
const publishJob = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE jobs SET status = 'published' WHERE id = $1 RETURNING *",
    [req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ message: "Job not found" });
  await triggerRebuild();
  res.json(rowToJob(rows[0]));
});

// POST /api/admin/jobs/:id/unpublish
const unpublishJob = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE jobs SET status = 'draft' WHERE id = $1 RETURNING *",
    [req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ message: "Job not found" });
  await triggerRebuild(); // pull it off the now-stale static site
  res.json(rowToJob(rows[0]));
});

module.exports = {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  publishJob,
  unpublishJob,
};
