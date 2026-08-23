import { Link } from "react-router-dom";
import Badge from "../ui/Badge";

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job.slug}`}
      className="block rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-sm2 hover:shadow-md2 hover:border-accent/40 transition-all"
    >
      <div className="flex items-start gap-3">
        <img
          src={job.companyLogo || "/icons.svg"}
          alt={job.company}
          className="h-11 w-11 rounded-lg border border-border object-contain bg-white shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[15px] truncate">{job.title}</h3>
          <p className="text-sm text-muted truncate">{job.company}</p>
        </div>
        {job.featured && <Badge tone="warning">Featured</Badge>}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {job.location && <Badge>{job.location}</Badge>}
        {job.workMode && <Badge tone="muted">{job.workMode}</Badge>}
        {job.jobType && <Badge tone="muted">{job.jobType}</Badge>}
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-muted-light">
        <span>{job.salary || "Salary not disclosed"}</span>
        <span>{job.postedAt}</span>
      </div>
    </Link>
  );
}
