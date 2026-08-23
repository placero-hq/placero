import Button from "../ui/Button";

export default function ApplyButton({ job, className = "" }) {
  if (!job?.applicationUrl && !job?.applyUrl) return null;
  const href = job.applicationUrl || job.applyUrl;

  const handleClick = () => {
    if (window.gtag) window.gtag("event", "apply_click", { job_slug: job.slug, company: job.company });
  };

  return (
    <Button as="a" href={href} target="_blank" rel="noopener noreferrer nofollow" onClick={handleClick} className={`w-full sm:w-auto ${className}`}>
      Apply Now →
    </Button>
  );
}
