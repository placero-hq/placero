const jwt = require("jsonwebtoken");

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "placero_session";

/**
 * Server-side session check for every admin route. This is the ONLY thing
 * that gates admin API access — the frontend route guard (ProtectedRoute)
 * is a UX nicety, not a security boundary. A request straight to
 * /api/admin/jobs with no/expired/tampered cookie always gets 401 here,
 * regardless of what the browser UI shows.
 */
function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: payload.sub, username: payload.username };
    return next();
  } catch (err) {
    cconsole.warn("Admin auth rejected:", err.message);
    return res.status(401).json({ message: "Session expired or invalid" });
  }
}

module.exports = { requireAdmin, COOKIE_NAME };
