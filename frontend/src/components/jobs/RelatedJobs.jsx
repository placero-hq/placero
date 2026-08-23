import { useJobs } from "../../context/JobsContext";
import JobList from "./JobList";

export default function RelatedJobs({ currentJob, count = 3 }) {
  const { jobs } = useJobs();
  if (!currentJob) return null;

  const others = jobs.filter((j) => j.slug !== currentJob.slug);
  // Prefer jobs in the same category, then fill remaining slots with other
  // recent listings so this section always has something to show.
  const sameCategory = others.filter((j) => j.category === currentJob.category);
  const rest = others.filter((j) => j.category !== currentJob.category);
  const related = [...sameCategory, ...rest].slice(0, count);

  if (related.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-border">
      <h3 className="text-lg font-bold mb-4">See more jobs like this</h3>
      <JobList jobs={related} />
    </div>
  );
}