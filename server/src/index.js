require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const adminAuthRoutes = require("./routes/adminAuth.routes");
const adminJobsRoutes = require("./routes/adminJobs.routes");
const publicJobsRoutes = require("./routes/publicJobs.routes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

app.set("trust proxy", 1); // Render sits behind a proxy; needed for secure cookies + rate limiting

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Two separate, explicit CORS allow-lists: the admin API only trusts the
// /admin origin(s); the public API only needs to serve the build step /
// client-side fallback. Neither ever allows "*" with credentials.
const adminOrigins = (process.env.ADMIN_ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
const publicOrigins = (process.env.PUBLIC_ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);

const adminCors = cors({
  origin(origin, callback) {
    if (!origin || adminOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});

const publicCors = cors({
  origin(origin, callback) {
    if (!origin || publicOrigins.length === 0 || publicOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
});

app.get("/health", (req, res) => res.json({ ok: true }));

// Everything under /api/admin (auth + jobs CRUD) shares the admin CORS
// allow-list and, for the jobs sub-router, the requireAdmin session check.
app.use("/api/admin", adminCors);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/jobs", adminJobsRoutes);

// Public, read-only surface — the only part of this API normal site
// visitors (or the Vercel build) ever reach.
app.use("/api", publicCors, publicJobsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`PlaceRo admin/API backend listening on port ${PORT}`);
});
