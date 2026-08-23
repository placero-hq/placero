import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const STATUS_TONE = { published: "success", draft: "muted", expired: "warning", archived: "muted" };

export default function AdminJobTable({ jobs, onDelete, onPublishToggle }) {
  if (!jobs || jobs.length === 0) {
    return <p className="text-sm text-muted py-10 text-center">No jobs yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs text-muted-light uppercase">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Featured</th>
            <th className="px-4 py-3">Posted</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-t border-border">
              <td className="px-4 py-3 font-medium">{job.title}</td>
              <td className="px-4 py-3 text-muted">{job.company}</td>
              <td className="px-4 py-3"><Badge tone={STATUS_TONE[job.status] || "muted"}>{job.status}</Badge></td>
              <td className="px-4 py-3">{job.featured ? "★" : "—"}</td>
              <td className="px-4 py-3 text-muted">{job.postedAt || job.posted_at}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button as={Link} to={`/admin/jobs/${job.id}/edit`} variant="outline" className="!px-3 !py-1.5 text-xs">Edit</Button>
                  <Button variant="secondary" className="!px-3 !py-1.5 text-xs" onClick={() => onPublishToggle(job)}>
                    {job.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button variant="danger" className="!px-3 !py-1.5 text-xs" onClick={() => onDelete(job)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
