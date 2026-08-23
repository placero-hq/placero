const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  // Fail loudly at boot rather than on the first query.
  console.error("DATABASE_URL is not set. Copy .env.example to .env and configure it.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  // Idle client errors should not crash the whole process.
  console.error("Unexpected PostgreSQL error on idle client", err);
});

module.exports = { pool };
