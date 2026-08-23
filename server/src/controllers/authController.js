const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const { asyncHandler } = require("../utils/helpers");
const { COOKIE_NAME } = require("../middleware/requireAdmin");

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true, // never readable from JS — matches adminApi.js, which stores no token itself
  secure: isProd, // HTTPS only in production (Render + Vercel are both HTTPS)
  sameSite: isProd ? "none" : "lax", // "none" needed cross-site (Vercel admin UI -> Render API)
  path: "/",
};

function signToken(admin) {
  const expiresIn = process.env.JWT_EXPIRES_IN || "12h";
  return jwt.sign({ sub: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn });
}

// POST /api/admin/login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const { rows } = await pool.query("SELECT * FROM admins WHERE username = $1", [username]);
  const admin = rows[0];

  // Constant-shape response whether the username exists or not, to avoid
  // leaking which part of the credential pair was wrong.
  const passwordHash = admin ? admin.password_hash : "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidin";
  const valid = await bcrypt.compare(password, passwordHash);

  if (!admin || !valid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = signToken(admin);
  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: 12 * 60 * 60 * 1000, // 12h, keep in sync with JWT_EXPIRES_IN default
  });
  res.json({ username: admin.username });
});

// POST /api/admin/logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.status(204).end();
});

// GET /api/admin/me
const me = asyncHandler(async (req, res) => {
  res.json({ username: req.admin.username });
});

module.exports = { login, logout, me };
