const express = require("express");
const { requireAdmin } = require("../middleware/requireAdmin");
const {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  publishJob,
  unpublishJob,
} = require("../controllers/adminJobsController");

const router = express.Router();

// Every route below requires a valid admin session. Applied once here
// rather than per-route so a new endpoint can never be added unauthenticated
// by accident.
router.use(requireAdmin);

router.get("/", listJobs);
router.post("/", createJob);
router.get("/:id", getJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.post("/:id/publish", publishJob);
router.post("/:id/unpublish", unpublishJob);

module.exports = router;
