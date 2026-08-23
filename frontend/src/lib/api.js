// Public read-only job data. Talks to the Render API for now; once static
// generation/ISR is wired up on the backend this is the only file that needs
// to change (swap fetch calls for build-time data).
import { API_BASE_URL } from "../config/env";

async function request(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export function fetchPublishedJobs() {
  return request("/api/jobs");
}

export function fetchJobBySlug(slug) {
  return request(`/api/jobs/${encodeURIComponent(slug)}`);
}
