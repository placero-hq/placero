import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setRobotsMeta } from "../lib/seo";

export default function NotFound() {
  // Keep this page out of the index — most static hosts serve the SPA
  // fallback with a 200 status, so this meta tag is the only reliable signal
  // that stops search engines from treating dead URLs as real pages.
  useEffect(() => {
    setRobotsMeta(true);
    return () => setRobotsMeta(false);
  }, []);

  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-muted mt-2">This page doesn't exist.</p>
      <Link to="/jobs" className="text-accent text-sm mt-4 inline-block">Browse jobs →</Link>
    </div>
  );
}
