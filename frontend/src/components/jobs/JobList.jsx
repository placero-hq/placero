import JobCard from "./JobCard";

export default function JobList({ jobs, emptyMessage = "No jobs found." }) {
  if (!jobs || jobs.length === 0) {
    return <p className="text-sm text-muted py-10 text-center">{emptyMessage}</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id || job.slug} job={job} />
      ))}
    </div>
  );
}
