import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setPageMeta } from "../lib/seo";
import { SITE_URL } from "../config/env";

export default function About() {
  useEffect(() => {
    setPageMeta({
      title: "About Us — PlaceRo",
      description:
        "PlaceRo curates jobs, internships and fresher openings from across the web, so students and freshers don't have to search everywhere.",
      canonical: `${SITE_URL}/about`,
    });
  }, []);

  return (
    <div className="container-page py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">About PlaceRo</h1>

      <p className="text-sm text-muted leading-relaxed">
        PlaceRo is a job discovery platform built for students, freshers and early-career professionals in
        India. We collect and organize job, internship and fresher openings from across the web into one
        place, so you can find real, current opportunities without hunting across dozens of company
        websites and job boards.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">What we do</h2>
      <p className="text-sm text-muted leading-relaxed">
        Every listing on PlaceRo includes the details that actually matter when you're deciding whether to
        apply — location, work mode, experience level, salary range, category and application deadline —
        laid out clearly and consistently, so you can scan and filter quickly instead of digging through
        long job descriptions.
      </p>
      <ul className="mt-3 space-y-1.5">
        {[
          "Jobs — full-time roles across software, data, marketing, design and more.",
          "Internships — for students looking to gain real work experience.",
          "Fresher openings — roles specifically open to candidates with 0–1 years of experience.",
          "A WhatsApp channel with fresh openings, for people who'd rather get updates on their phone than check a website daily.",
        ].map((item, i) => (
          <li key={i} className="text-sm text-muted flex gap-2 leading-relaxed">
            <span className="text-accent mt-0.5">•</span> {item}
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-bold mt-8 mb-2">Who's behind it</h2>
      <p className="text-sm text-muted leading-relaxed">
        PlaceRo is run independently by a small team based in India that cares about making the early
        stages of a job search less overwhelming. We're not a recruitment agency and we don't charge
        candidates anything to browse or apply — listings link directly to the employer's own application
        process.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">Our approach</h2>
      <p className="text-sm text-muted leading-relaxed">
        We aim to keep listings accurate and remove ones that have expired, though details ultimately come
        from the employer or original source and can change without notice — we always recommend
        double-checking specifics on the employer's own page before applying. If you ever spot a listing
        that looks outdated, incorrect, or suspicious, we'd genuinely appreciate you letting us know.
      </p>

      <p className="text-sm text-muted leading-relaxed mt-6">
        Have a question, feedback, or a job to share with us?{" "}
        <Link to="/contact" className="text-accent underline">
          Get in touch
        </Link>
        .
      </p>
    </div>
  );
}