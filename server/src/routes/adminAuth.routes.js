const express = require("express");
const rateLimit = require("express-rate-limit");
const { login, logout, me } = require("../controllers/authController");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();

// Slow down credential-guessing without needing an external service.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again later." },
});

router.post("/login", loginLimiter, login);
// No requireAdmin here: logging out should always succeed and clear the
// cookie, even if the session already expired or was tampered with.
router.post("/logout", logout);
router.get("/me", requireAdmin, me);

module.exports = router;
