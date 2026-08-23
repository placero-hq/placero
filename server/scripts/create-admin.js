// Creates (or updates the password for) the single V1 PlaceRo admin account,
// using ADMIN_USERNAME / ADMIN_PASSWORD from the environment. Never stores
// a plaintext password — only the bcrypt hash goes into the database.
//
// Usage:
//   ADMIN_USERNAME=placero_admin ADMIN_PASSWORD='a-strong-password' npm run create-admin
// or set both in .env and just run: npm run create-admin
//
// Re-run any time to rotate the password. This is deliberately a standalone
// script (not an API endpoint) so it can only be run by someone with server/
// environment access — not from the browser.

require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error("Set ADMIN_USERNAME and ADMIN_PASSWORD (in .env or the shell) before running this script.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD should be at least 8 characters.");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
  });

  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO admins (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [username, passwordHash],
  );

  console.log(`Admin account "${username}" is ready. You can now log in at /admin.`);
  console.log("Tip: remove ADMIN_PASSWORD from your .env now that the hash is stored in the database.");

  await pool.end();
}

main().catch((err) => {
  console.error("Failed to create admin account:", err);
  process.exit(1);
});
