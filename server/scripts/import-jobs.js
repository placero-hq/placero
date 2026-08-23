// One-time (or repeatable) import of existing jobs from the old Google
// Sheets database into PostgreSQL. Google Sheets is NOT queried live here —
// export your sheet first, then point this script at the export file.
//
// HOW TO EXPORT YOUR SHEET
//   File -> Download -> Comma-separated values (.csv), or
//   File -> Download -> JSON if you already have that via Apps Script.
// Save it to scripts/data/jobs-export.csv (or .json) or point
// GOOGLE_SHEETS_EXPORT_PATH at wherever you saved it.
//
// USAGE
//   npm run import-jobs
//   npm run import-jobs -- --file=./scripts/data/my-export.csv
//   npm run import-jobs -- --dry-run          (preview without writing)
//
// COLUMN MAPPING
//   The script matches columns case-insensitively and tolerates the common
//   header spellings from the old sheet. Edit COLUMN_ALIASES below if your
//   sheet uses different headers — nothing is invented for missing data.

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { Pool } = require("pg");
const { slugify } = require("../src/utils/slugify");
const { toArray } = require("../src/utils/helpers");

const COLUMN_ALIASES = {
  company: ["company", "company name", "employer"],
  companyLogo: ["company_logo", "companylogo", "logo", "logo url"],
  title: ["title", "job title", "role", "position"],
  location: ["location", "city"],
  workMode: ["work_mode", "workmode", "work mode", "mode"],
  experience: ["experience", "experience level"],
  salary: ["salary", "ctc", "compensation"],
  jobType: ["job_type", "jobtype", "job type", "type"],
  category: ["category", "job category"],
  skills: ["skills", "tech stack", "tags"],
  description: ["description", "job description", "about the role"],
  responsibilities: ["responsibilities", "roles and responsibilities"],
  requirements: ["requirements", "qualifications"],
  eligibility: ["eligibility", "eligibility criteria"],
  benefits: ["benefits", "perks"],
  applicationUrl: ["application_url", "applicationurl", "apply link", "apply url", "application link"],
  sourceUrl: ["source_url", "sourceurl", "source", "job link"],
  postedAt: ["posted_at", "postedat", "posted date", "date posted"],
  deadline: ["deadline", "last date", "application deadline"],
  status: ["status"],
  featured: ["featured"],
};

function findValue(record, keys) {
  const lowerMap = {};
  for (const k of Object.keys(record)) lowerMap[k.trim().toLowerCase()] = record[k];
  for (const alias of keys) {
    const val = lowerMap[alias.toLowerCase()];
    if (val !== undefined && val !== null && String(val).trim() !== "") return String(val).trim();
  }
  return undefined;
}

function normalizeRecord(record) {
  const job = {};
  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    const value = findValue(record, aliases);
    if (value !== undefined) job[field] = value;
  }
  return job;
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function parseBool(value) {
  if (value === undefined) return false;
  return ["true", "yes", "1", "y"].includes(String(value).trim().toLowerCase());
}

async function loadRecords(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const raw = fs.readFileSync(filePath, "utf8");
  if (ext === ".json") {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : data.jobs || [];
  }
  return parse(raw, { columns: true, skip_empty_lines: true, trim: true });
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const fileArg = args.find((a) => a.startsWith("--file="));
  const filePath = fileArg ? fileArg.split("=")[1] : process.env.GOOGLE_SHEETS_EXPORT_PATH;

  if (!filePath || !fs.existsSync(filePath)) {
    console.error(
      `Export file not found at "${filePath}".\n` +
        `Export your Google Sheet as CSV/JSON and either:\n` +
        `  - save it to the path in GOOGLE_SHEETS_EXPORT_PATH, or\n` +
        `  - run: npm run import-jobs -- --file=./path/to/export.csv`,
    );
    process.exit(1);
  }

  const records = await loadRecords(filePath);
  console.log(`Loaded ${records.length} rows from ${filePath}`);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
  });

  let imported = 0;
  let skipped = 0;
  const skippedRows = [];

  for (const [i, raw] of records.entries()) {
    const job = normalizeRecord(raw);

    if (!job.title || !job.company) {
      skipped += 1;
      skippedRows.push({ row: i + 1, reason: "missing title or company" });
      continue;
    }

    const baseSlug = slugify(`${job.title} ${job.company}`);
    let slug = baseSlug;
    let suffix = 1;

    if (!dryRun) {
      // eslint-disable-next-line no-await-in-loop
      while ((await pool.query("SELECT 1 FROM jobs WHERE slug = $1", [slug])).rows.length > 0) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const row = {
      company: job.company,
      company_logo: job.companyLogo || null,
      title: job.title,
      slug,
      location: job.location || null,
      work_mode: job.workMode || null,
      experience: job.experience || null,
      salary: job.salary || null,
      job_type: job.jobType || null,
      category: job.category || null,
      skills: toArray(job.skills, { splitOn: "," }),
      description: job.description || null,
      responsibilities: toArray(job.responsibilities, { splitOn: "\n" }),
      requirements: toArray(job.requirements, { splitOn: "\n" }),
      eligibility: toArray(job.eligibility, { splitOn: "\n" }),
      benefits: toArray(job.benefits, { splitOn: "\n" }),
      application_url: job.applicationUrl || null,
      source_url: job.sourceUrl || null,
      posted_at: parseDate(job.postedAt),
      deadline: parseDate(job.deadline),
      status: job.status && ["draft", "published", "expired", "archived"].includes(job.status.toLowerCase())
        ? job.status.toLowerCase()
        : "draft", // default to draft so nothing goes live unreviewed
      featured: parseBool(job.featured),
    };

    if (dryRun) {
      console.log(`[dry-run] would import: ${row.title} @ ${row.company} -> /jobs/${row.slug}`);
      imported += 1;
      continue;
    }

    const keys = Object.keys(row);
    const values = Object.values(row);
    const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(", ");
    // eslint-disable-next-line no-await-in-loop
    await pool.query(`INSERT INTO jobs (${keys.join(", ")}) VALUES (${placeholders})`, values);
    imported += 1;
  }

  console.log(`\nImport ${dryRun ? "preview" : "complete"}: ${imported} imported, ${skipped} skipped.`);
  if (skippedRows.length) {
    console.log("Skipped rows:", skippedRows);
  }
  if (!dryRun) {
    console.log("All imported jobs were set to status=draft unless the sheet specified otherwise.");
    console.log("Review them in /admin and publish the ones that are still current.");
  }

  await pool.end();
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
