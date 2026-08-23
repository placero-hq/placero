require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
  });

  const sql = fs.readFileSync(path.join(__dirname, "..", "db", "schema.sql"), "utf8");

  console.log("Applying schema.sql to", maskUrl(process.env.DATABASE_URL));
  await pool.query(sql);
  console.log("Migration complete: `admins` and `jobs` tables are ready.");

  await pool.end();
}

function maskUrl(url) {
  if (!url) return "(no DATABASE_URL set)";
  return url.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:****@");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
