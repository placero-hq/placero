import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import JobList from "../components/jobs/JobList";
import SectionHeader from "../components/ui/SectionHeader";
import Button from "../components/ui/Button";
import { setPageMeta } from "../lib/seo";
import { SITE_URL } from "../config/env";

export default function Home() {
  const { jobs, loading } = useJobs();

  useEffect(() => {
    setPageMeta({
      title: "PlaceRo — Jobs, Internships & Fresher Openings",
      description: "Find the latest jobs, internships and fresher openings, curated daily.",
      canonical: `${SITE_URL}/`,
    });
  }, []);

  const featured = jobs.filter((j) => j.featured).slice(0, 6);
  const recent = jobs.slice(0, 9);

  return (
    <div className="container-page py-8">
      <section className="text-center py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Find your next opportunity</h1>
        <p className="text-muted mt-3 max-w-lg mx-auto">Jobs, internships and fresher openings updated daily.</p>
        <div className="flex justify-center gap-3 mt-6">
          <Button as={Link} to="/jobs">Browse Jobs</Button>
          <Button as={Link} to="/internships" variant="secondary">Internships</Button>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mt-6">
          <SectionHeader title="Featured openings" />
          <JobList jobs={featured} />
        </section>
      )}

      <section className="mt-10">
        <SectionHeader title="Recently posted" action={<Link to="/jobs" className="text-sm text-accent font-medium">View all →</Link>} />
        {loading ? <p className="text-sm text-muted">Loading jobs…</p> : <JobList jobs={recent} />}
      </section>
    </div>
  );
}
