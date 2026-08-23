import { useState } from "react";
import Button from "../../components/ui/Button";
import { parseJobJson } from "../utils/parseJobJson";

const EMPTY_JOB = {
  company: "", companyLogo: "", title: "", location: "", workMode: "",
  experience: "", salary: "", jobType: "", category: "", skills: "",
  description: "", responsibilities: "", requirements: "", eligibility: "",
  benefits: "", applicationUrl: "", sourceUrl: "", postedAt: "", deadline: "",
  status: "draft", featured: false,
};

const FIELD_GROUPS = [
  { legend: "Basics", fields: ["company", "companyLogo", "title", "location", "workMode", "experience"] },
  { legend: "Role details", fields: ["salary", "jobType", "category", "skills"] },
  { legend: "Content", fields: ["description", "responsibilities", "requirements", "eligibility", "benefits"] },
  { legend: "Links & dates", fields: ["applicationUrl", "sourceUrl", "postedAt", "deadline"] },
];

const LABELS = {
  company: "Company", companyLogo: "Company Logo URL", title: "Job Title", location: "Location",
  workMode: "Work Mode", experience: "Experience", salary: "Salary", jobType: "Job Type",
  category: "Category", skills: "Skills (comma-separated)", description: "Description",
  responsibilities: "Responsibilities (one per line)", requirements: "Requirements (one per line)",
  eligibility: "Eligibility (one per line)", benefits: "Benefits (one per line)",
  applicationUrl: "Application URL", sourceUrl: "Source URL", postedAt: "Posted Date", deadline: "Application Deadline",
};

const TEXTAREA_FIELDS = ["description", "responsibilities", "requirements", "eligibility", "benefits"];
const DATE_FIELDS = ["postedAt", "deadline"];

export default function AdminJobForm({ initialJob, onSubmit, submitLabel = "Save Draft" }) {
  const [job, setJob] = useState({ ...EMPTY_JOB, ...initialJob });
  const [saving, setSaving] = useState(false);

  const [jsonText, setJsonText] = useState("");
const [jsonOpen, setJsonOpen] = useState(false);
const [jsonMessage, setJsonMessage] = useState(null); // { type: "success" | "error", text }

const handleFillFromJson = () => {
  if (!jsonText.trim()) {
    setJsonMessage({ type: "error", text: "Paste some JSON first." });
    return;
  }
  try {
    const { fields, filledCount, ignoredKeys } = parseJobJson(jsonText);
    if (filledCount === 0) {
      setJsonMessage({ type: "error", text: "No recognizable job fields found in that JSON." });
      return;
    }
    setJob((j) => ({ ...j, ...fields }));
    const ignoredNote = ignoredKeys.length ? ` Ignored: ${ignoredKeys.join(", ")}.` : "";
    setJsonMessage({
      type: "success",
      text: `Filled ${filledCount} field${filledCount === 1 ? "" : "s"} from JSON — review below, then Save Draft or Publish.${ignoredNote}`,
    });
  } catch (err) {
    setJsonMessage({ type: "error", text: err.message });
  }
};

  const update = (field, value) => setJob((j) => ({ ...j, [field]: value }));

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ ...job, status: status || job.status });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-8">

<fieldset className="rounded-xl border border-border bg-surface p-5">
  <button
    type="button"
    onClick={() => setJsonOpen((v) => !v)}
    className="flex items-center gap-2 text-sm font-bold w-full text-left"
  >
    <span>{jsonOpen ? "▾" : "▸"}</span> Paste JSON to auto-fill this form
  </button>

  {jsonOpen && (
    <div className="mt-3 space-y-3">
      <p className="text-xs text-muted">
        Paste a single job as a JSON object (field names like <code>title</code>, <code>company</code>,
        <code> applicationUrl</code>, <code>skills</code>, etc.). This only fills the fields below — nothing
        is saved until you click Save Draft or Publish.
      </p>
      <textarea
        rows={8}
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder={'{\n  "company": "TechNova Solutions",\n  "title": "Frontend Developer",\n  "applicationUrl": "https://example.com/apply",\n  "skills": ["React", "JavaScript", "CSS"],\n  "responsibilities": ["Build UI", "Write tests"]\n}'}
        className="w-full rounded-md border border-border px-3 py-2 text-xs font-mono outline-none focus:border-accent"
      />
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" onClick={handleFillFromJson}>Fill form from JSON</Button>
        {jsonMessage && (
          <p className={`text-xs ${jsonMessage.type === "error" ? "text-red-600" : "text-green-700"}`}>
            {jsonMessage.text}
          </p>
        )}
      </div>
    </div>
  )}
</fieldset>

      {FIELD_GROUPS.map((group) => (
        <fieldset key={group.legend} className="rounded-xl border border-border bg-surface p-5">
          <legend className="text-sm font-bold px-1">{group.legend}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            {group.fields.map((field) => (
              <div key={field} className={TEXTAREA_FIELDS.includes(field) ? "sm:col-span-2" : ""}>
                <label className="block text-xs font-medium text-muted mb-1">{LABELS[field]}</label>
                {TEXTAREA_FIELDS.includes(field) ? (
                  <textarea
                    rows={3}
                    value={job[field]}
                    onChange={(e) => update(field, e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                ) : (
                  <input
                    type={DATE_FIELDS.includes(field) ? "date" : "text"}
                    value={job[field]}
                    onChange={(e) => update(field, e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                )}
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      <fieldset className="rounded-xl border border-border bg-surface p-5 flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={job.featured} onChange={(e) => update("featured", e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          Status:
          <select value={job.status} onChange={(e) => update("status", e.target.value)} className="rounded-md border border-border px-2 py-1">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="expired">Expired</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </fieldset>

      <div className="flex gap-3">
        <Button variant="outline" disabled={saving} onClick={(e) => handleSubmit(e, "draft")}>Save Draft</Button>
        <Button disabled={saving} onClick={(e) => handleSubmit(e, "published")}>{saving ? "Saving…" : submitLabel}</Button>
      </div>
    </form>
  );
}
