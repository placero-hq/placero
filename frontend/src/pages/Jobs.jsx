import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import JobList from "../components/jobs/JobList";
import JobFilters from "../components/jobs/JobFilters";
import { setPageMeta } from "../lib/seo";
import { SITE_URL } from "../config/env";

export default function Jobs({ filterFn, title = "All Jobs", metaTitle, metaDescription, canonical }) {
  const { jobs, loading } = useJobs();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  // Reflect filters in the URL so results are shareable/bookmarkable, but
  // keep the canonical tag pointed at the clean path below — search/category
  // combinations are near-duplicate content and shouldn't compete against
  // the base page (or each other) for ranking.
  useEffect(() => {
    const params = {};
    if (search.trim()) params.q = search.trim();
    if (category) params.category = category;
    setSearchParams(params, { replace: true });
  }, [search, category, setSearchParams]);

  useEffect(() => {
    setPageMeta({
      title: metaTitle || `${title} — PlaceRo`,
      description: metaDescription || `Browse ${title.toLowerCase()} on PlaceRo.`,
      canonical: canonical || `${SITE_URL}${window.location.pathname}`,
    });
  }, [metaTitle, metaDescription, canonical, title]);

  const filtered = useMemo(() => {
    let list = filterFn ? jobs.filter(filterFn) : jobs;
    if (category) list = list.filter((j) => j.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((j) => `${j.title} ${j.company} ${(j.skills || []).join(" ")}`.toLowerCase().includes(q));
    }
    return list;
  }, [jobs, filterFn, category, search]);

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold mb-5">{title}</h1>
      <JobFilters search={search} onSearchChange={setSearch} category={category} onCategoryChange={setCategory} />
      {loading ? <p className="text-sm text-muted">Loading jobs…</p> : <JobList jobs={filtered} />}
    </div>
  );
}
