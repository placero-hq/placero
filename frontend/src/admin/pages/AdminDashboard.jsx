import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../lib/adminApi";
import AdminLayout from "../components/AdminLayout";
import AdminJobTable from "../components/AdminJobTable";
import Button from "../../components/ui/Button";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await adminApi.listJobs({ search, status: statusFilter });
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [search, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const stats = {
    published: jobs.filter((j) => j.status === "published").length,
    draft: jobs.filter((j) => j.status === "draft").length,
    expired: jobs.filter((j) => j.status === "expired").length,
  };

  const handleDelete = async (job) => {
    if (!confirm(`Delete "${job.title}"?`)) return;
    await adminApi.deleteJob(job.id);
    load();
  };

  const handlePublishToggle = async (job) => {
    if (job.status === "published") await adminApi.unpublishJob(job.id);
    else await adminApi.publishJob(job.id);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button as={Link} to="/admin/jobs/new">Add Job</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[["Published", stats.published], ["Drafts", stats.draft], ["Expired", stats.expired]].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-muted-light uppercase">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input placeholder="Search jobs…" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-md border border-border px-3 py-2 text-sm" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border border-border px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="expired">Expired</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? <p className="text-sm text-muted">Loading…</p> : (
        <AdminJobTable jobs={jobs} onDelete={handleDelete} onPublishToggle={handlePublishToggle} />
      )}
    </AdminLayout>
  );
}
