// Authenticated admin client. Uses httpOnly session cookies set by the
// backend on login — no token is ever stored in localStorage or JS.
import { API_BASE_URL } from "../config/env";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 401 || res.status === 403) {
    const err = new Error("Not authenticated");
    err.unauthorized = true;
    throw err;
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const adminApi = {
  login: (username, password) =>
    request("/api/admin/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => request("/api/admin/logout", { method: "POST" }),
  me: () => request("/api/admin/me"),

  listJobs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/admin/jobs${qs ? `?${qs}` : ""}`);
  },
  getJob: (id) => request(`/api/admin/jobs/${id}`),
  createJob: (data) => request("/api/admin/jobs", { method: "POST", body: JSON.stringify(data) }),
  updateJob: (id, data) => request(`/api/admin/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteJob: (id) => request(`/api/admin/jobs/${id}`, { method: "DELETE" }),
  publishJob: (id) => request(`/api/admin/jobs/${id}/publish`, { method: "POST" }),
  unpublishJob: (id) => request(`/api/admin/jobs/${id}/unpublish`, { method: "POST" }),
};
