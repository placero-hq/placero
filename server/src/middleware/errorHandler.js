// Centralized error handler. Keeps internal error details out of API
// responses (no stack traces, no raw DB error messages to the client).
function errorHandler(err, req, res, _next) {
  console.error(err);

  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err.code === "23505") {
    // Postgres unique_violation (e.g. duplicate slug)
    return res.status(409).json({ message: "A job with that slug already exists." });
  }

  return res.status(500).json({ message: "Internal server error" });
}

function notFoundHandler(req, res) {
  res.status(404).json({ message: "Not found" });
}

module.exports = { errorHandler, notFoundHandler };
