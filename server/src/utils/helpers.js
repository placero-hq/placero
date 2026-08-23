// Wraps an async route handler so rejected promises reach Express's error middleware.
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Splits free-text into an array: comma-separated for `skills`,
// one-per-line for the long-form list fields. Accepts an array as-is
// (already-structured input, e.g. from a JSON import) and returns [].
function toArray(value, { splitOn = "\n" } = {}) {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (value === undefined || value === null) return [];
  return String(value)
    .split(splitOn)
    .map((v) => v.trim())
    .filter(Boolean);
}

// DB row (snake_case) -> API/frontend shape (camelCase), matching what
// src/lib/api.js and src/admin/components/AdminJobForm.jsx expect.
function rowToJob(row) {
  if (!row) return null;
  return {
    id: row.id,
    company: row.company,
    companyLogo: row.company_logo || "",
    title: row.title,
    slug: row.slug,
    location: row.location || "",
    workMode: row.work_mode || "",
    experience: row.experience || "",
    salary: row.salary || "",
    jobType: row.job_type || "",
    category: row.category || "",
    skills: row.skills || [],
    description: row.description || "",
    responsibilities: row.responsibilities || [],
    requirements: row.requirements || [],
    eligibility: row.eligibility || [],
    benefits: row.benefits || [],
    applicationUrl: row.application_url || "",
    sourceUrl: row.source_url || "",
    postedAt: row.posted_at ? formatDate(row.posted_at) : "",
    deadline: row.deadline ? formatDate(row.deadline) : "",
    status: row.status,
    featured: !!row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function formatDate(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10); // YYYY-MM-DD, matches <input type="date">
}

// API/admin-form payload (camelCase, possibly free-text lists) -> DB columns.
// Only fields the admin actually provided are included, so partial updates
// (PUT with a subset of fields) don't clobber existing data with blanks.
function jobPayloadToColumns(payload) {
  const map = {
    company: "company",
    companyLogo: "company_logo",
    title: "title",
    location: "location",
    workMode: "work_mode",
    experience: "experience",
    salary: "salary",
    jobType: "job_type",
    category: "category",
    applicationUrl: "application_url",
    sourceUrl: "source_url",
    status: "status",
    featured: "featured",
  };
  const listMap = {
    skills: { column: "skills", splitOn: "," },
    responsibilities: { column: "responsibilities", splitOn: "\n" },
    requirements: { column: "requirements", splitOn: "\n" },
    eligibility: { column: "eligibility", splitOn: "\n" },
    benefits: { column: "benefits", splitOn: "\n" },
  };
  const dateFields = { postedAt: "posted_at", deadline: "deadline" };

  const columns = {};

  for (const [key, column] of Object.entries(map)) {
    if (payload[key] !== undefined) columns[column] = payload[key] === "" ? null : payload[key];
  }
  for (const [key, { column, splitOn }] of Object.entries(listMap)) {
    if (payload[key] !== undefined) columns[column] = toArray(payload[key], { splitOn });
  }
  for (const [key, column] of Object.entries(dateFields)) {
    if (payload[key] !== undefined) columns[column] = payload[key] === "" ? null : payload[key];
  }
  if (payload.description !== undefined) columns.description = payload.description;

  return columns;
}

module.exports = { asyncHandler, toArray, rowToJob, jobPayloadToColumns, formatDate };
