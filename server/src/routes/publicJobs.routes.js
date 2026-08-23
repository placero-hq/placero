const express = require("express");
const { listPublicJobs, getPublicJobBySlug } = require("../controllers/publicJobsController");
const { getSitemap } = require("../controllers/sitemapController");

const router = express.Router();

// Read-only, unauthenticated. This is the ONLY part of the API public users
// (or the Vercel build) ever call — no admin data is reachable from here.
router.get("/jobs", listPublicJobs);
router.get("/jobs/:slug", getPublicJobBySlug);
router.get("/sitemap.xml", getSitemap);

module.exports = router;
