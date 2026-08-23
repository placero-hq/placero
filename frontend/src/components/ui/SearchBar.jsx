export default function SearchBar({ value, onChange, placeholder = "Search jobs, companies, skills…" }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 shadow-sm2">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-muted-light">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-light"
      />
    </div>
  );
}
