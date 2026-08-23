import SearchBar from "../ui/SearchBar";

const CATEGORIES = ["All", "Software", "Data", "Marketing", "Design", "General"];

export default function JobFilters({ search, onSearchChange, category, onCategoryChange }) {
  return (
    <div className="space-y-3 mb-6">
      <SearchBar value={search} onChange={onSearchChange} />
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const active = category === c || (c === "All" && !category);
          return (
            <button
              key={c}
              onClick={() => onCategoryChange(c === "All" ? "" : c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors ${
                active ? "bg-accent text-white border-accent" : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
