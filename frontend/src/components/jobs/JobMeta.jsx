export default function JobMeta({ job }) {
  const rows = [
    ["Location", job.location],
    ["Work Mode", job.workMode],
    ["Experience", job.experience],
    ["Job Type", job.jobType],
    ["Salary", job.salary],
    ["Category", job.category],
    ["Posted", job.postedAt],
    ["Deadline", job.deadline],
  ].filter(([, v]) => v);

  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-border bg-surface p-4 sm:p-5">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-muted-light uppercase tracking-wide">{label}</dt>
          <dd className="text-sm font-medium mt-0.5">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
