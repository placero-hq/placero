import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../../context/JobsContext";

export default function SearchSuggest({
  placeholder = "Search jobs, companies, skills…",
  className = "",
  onNavigate,
}) {
  const { jobs } = useJobs();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return jobs
      .filter((j) =>
        `${j.title} ${j.company} ${(j.skills || []).join(" ")} ${j.location || ""}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 6);
  }, [jobs, query]);

  // Close the dropdown when clicking anywhere outside the search bar.
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const goToJob = (job) => {
    setOpen(false);
    setQuery("");
    navigate(`/jobs/${job.slug}`);
    onNavigate?.();
  };

  const goToSearch = () => {
    setOpen(false);
    navigate(query.trim() ? `/jobs?q=${encodeURIComponent(query.trim())}` : "/jobs");
    onNavigate?.();
  };

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") goToSearch();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) goToJob(suggestions[activeIndex]);
      else goToSearch();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 shadow-sm2 focus-within:border-accent/60 transition-colors">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0 text-muted-light">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-light"
          aria-label="Search jobs"
          aria-expanded={open}
          role="combobox"
          aria-autocomplete="list"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="shrink-0 text-muted-light hover:text-muted"
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 z-50 mt-2 rounded-lg border border-border bg-surface shadow-md2 overflow-hidden">
          {suggestions.length > 0 ? (
            <>
              <ul className="max-h-80 overflow-y-auto py-1">
                {suggestions.map((job, i) => (
                  <li key={job.slug}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goToJob(job)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                        activeIndex === i ? "bg-accent/10" : "hover:bg-accent/5"
                      }`}
                    >
                      <img
                        src={job.companyLogo || "/icons.svg"}
                        alt={job.company}
                        className="h-8 w-8 rounded-md border border-border object-contain bg-white shrink-0"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium truncate">{job.title}</span>
                        <span className="block text-xs text-muted truncate">
                          {job.company}
                          {job.location ? ` · ${job.location}` : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={goToSearch}
                className="w-full border-t border-border px-3.5 py-2.5 text-left text-xs font-medium text-accent hover:bg-accent/5"
              >
                See all results for "{query.trim()}" →
              </button>
            </>
          ) : (
            <p className="px-3.5 py-3 text-sm text-muted">No jobs found for "{query.trim()}"</p>
          )}
        </div>
      )}
    </div>
  );
}