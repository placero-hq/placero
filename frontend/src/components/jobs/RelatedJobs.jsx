import { useJobs } from "../../context/JobsContext";
import JobList from "./JobList";

export default function RelatedJobs({ currentJob, count = 3 }) {
  const { jobs } = useJobs();
  if (!currentJob) return null;

  const related = jobs
    .filter((j) => j.slug !== currentJob.slug && j.category === currentJob.category)
    .slice(0, count);

  if (related.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Related jobs</h3>
      <JobList jobs={related} />
    </div>
  );
}
