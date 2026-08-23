// Fires the Vercel Deploy Hook (if configured) so the public static site
// regenerates after a job is published/unpublished/edited. Best-effort and
// non-blocking: the admin request should never fail just because this does.
async function triggerRebuild() {
  const url = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!url) return;
  try {
    await fetch(url, { method: "POST" });
  } catch (err) {
    console.error("Failed to trigger Vercel rebuild hook:", err.message);
  }
}

module.exports = { triggerRebuild };
