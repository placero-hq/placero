import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import SearchSuggest from "../ui/SearchSuggest";

const LINKS = [
  { to: "/jobs", label: "Jobs" },
  { to: "/internships", label: "Internships" },
  { to: "/freshers", label: "Freshers" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="container-page flex items-center gap-4 h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <img src="/favicon.png" alt="PlaceRo" className="h-8 w-8" />
          PlaceRo
        </Link>

        <div className="hidden md:block flex-1 max-w-md">
          <SearchSuggest />
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <nav className="hidden sm:flex items-center gap-6">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `text-sm font-medium ${isActive ? "text-accent" : "text-muted hover:text-ink"}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <button className="sm:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="sm:hidden border-t border-border bg-surface px-5 py-4 flex flex-col gap-4">
          <SearchSuggest onNavigate={() => setOpen(false)} />
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-muted hover:text-ink">
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}