export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Canonical production origin, used to build absolute canonical/OG URLs and
// the sitemap. Override with VITE_SITE_URL if the domain ever changes.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://placero.in").replace(/\/$/, "");
