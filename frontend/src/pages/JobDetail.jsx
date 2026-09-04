import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import JobMeta from "../components/jobs/JobMeta";
import ApplyButton from "../components/jobs/ApplyButton";
import RelatedJobs from "../components/jobs/RelatedJobs";
import NativeBannerAd from "../components/ads/NativeBannerAd";
import BannerAd from "../components/ads/BannerAd";
import { setPageMeta, setJobPostingJsonLd, isJobExpired } from "../lib/seo";
import { SITE_URL } from "../config/env";
import NotFound from "./NotFound";

function Section({ title, content }) {
  if (!content) return null;
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <p className="text-sm text-muted whitespace-pre-line leading-relaxed">{content}</p>
    </div>
  );
}

function ListSection({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted flex gap-2">
            <span className="text-accent mt-0.5">•</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function JobDetail() {
  const { slug } = useParams();
  const { jobs, loading } = useJobs();
  const job = jobs.find((j) => j.slug === slug);
  const expired = job ? isJobExpired(job) : false;

  useEffect(() => {
    if (!job) return;
    const expired = isJobExpired(job);
    setPageMeta({
      title: `${job.title} at ${job.company} — PlaceRo`,
      description: (job.description || `${job.title} at ${job.company}. Apply now on PlaceRo.`).slice(0, 155),
      canonical: `${SITE_URL}/jobs/${job.slug}`,
      image: job.companyLogo || undefined,
      type: "article",
      // Google penalizes sites that keep expired JobPosting pages indexed —
      // pull them from the index instead of leaving a stale listing live.
      noindex: expired,
    });
    setJobPostingJsonLd(job);
    if (window.gtag) window.gtag("event", "job_view", { job_slug: job.slug });
    return () => setJobPostingJsonLd(null);
  }, [job]);

  if (loading) return <div className="container-page py-10 text-sm text-muted">Loading…</div>;
  if (!job) return <NotFound />;

  return (
    <div className="container-page py-8 max-w-3xl">
      <Link to="/jobs" className="text-sm text-accent">← Back to jobs</Link>

      <div className="flex items-start gap-4 mt-4">
        <img src={job.companyLogo || "/icons.svg"} alt={job.company} className="h-14 w-14 rounded-lg border border-border object-contain bg-white" />
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-muted">{job.company}</p>
        </div>
      </div>

      {expired && (
        <p className="mt-4 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-muted">
          This listing's deadline has passed and may no longer be accepting applications.
        </p>
      )}

      <div className="mt-6"><JobMeta job={job} /></div>

      <NativeBannerAd />

      <Section title="Job Description" content={job.description} />
      <ListSection title="Responsibilities" items={job.responsibilities} />
      <ListSection title="Requirements" items={job.requirements} />
      <ListSection title="Eligibility" items={job.eligibility} />
      <ListSection title="Benefits" items={job.benefits} />

      <div className="mt-8"><ApplyButton job={job} /></div>

      <BannerAd />

      <RelatedJobs currentJob={job} />
    </div>
  );
}