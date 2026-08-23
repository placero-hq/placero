// Turns a pasted JSON object into the same shape AdminJobForm's local state
// uses (plain strings for list fields — comma-separated for skills,
// newline-separated for the rest — since that's what the textareas edit).

const FIELD_ALIASES = {
    company: "company",
    companyname: "company",
    company_name: "company",
    companylogo: "companyLogo",
    company_logo: "companyLogo",
    logo: "companyLogo",
    logourl: "companyLogo",
    title: "title",
    jobtitle: "title",
    job_title: "title",
    role: "title",
    position: "title",
    location: "location",
    city: "location",
    workmode: "workMode",
    work_mode: "workMode",
    mode: "workMode",
    experience: "experience",
    experiencelevel: "experience",
    salary: "salary",
    ctc: "salary",
    compensation: "salary",
    jobtype: "jobType",
    job_type: "jobType",
    type: "jobType",
    category: "category",
    jobcategory: "category",
    skills: "skills",
    tags: "skills",
    techstack: "skills",
    description: "description",
    jobdescription: "description",
    about: "description",
    responsibilities: "responsibilities",
    roles: "responsibilities",
    requirements: "requirements",
    qualifications: "requirements",
    eligibility: "eligibility",
    eligibilitycriteria: "eligibility",
    benefits: "benefits",
    perks: "benefits",
    applicationurl: "applicationUrl",
    application_url: "applicationUrl",
    applyurl: "applicationUrl",
    apply_url: "applicationUrl",
    applylink: "applicationUrl",
    sourceurl: "sourceUrl",
    source_url: "sourceUrl",
    source: "sourceUrl",
    joblink: "sourceUrl",
    postedat: "postedAt",
    posted_at: "postedAt",
    posteddate: "postedAt",
    datePosted: "postedAt",
    deadline: "deadline",
    lastdate: "deadline",
    applicationdeadline: "deadline",
    validthrough: "deadline",
    status: "status",
    featured: "featured",
  };
  
  const LIST_FIELDS = new Set(["skills", "responsibilities", "requirements", "eligibility", "benefits"]);
  const DATE_FIELDS = new Set(["postedAt", "deadline"]);
  
  function unescapeLiteralNewlines(value) {
    return String(value).replace(/\\r\\n|\\n|\\r/g, "\n");
  }
  
  function normalizeKey(key) {
    return key.replace(/[\s\-]+/g, "_").toLowerCase().replace(/_/g, "");
  }
  
  function listToText(value, joinWith) {
    if (Array.isArray(value)) {
      return value
        .map((item) => unescapeLiteralNewlines(item).trim())
        .filter(Boolean)
        .join(joinWith);
    }
    return unescapeLiteralNewlines(value)
      .split(joinWith === "," ? /,|\n/ : "\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .join(joinWith);
  }
  
  function normalizeDate(value) {
    const str = String(value).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
    const d = new Date(str);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  }
  
  function normalizeBoolean(value) {
    if (typeof value === "boolean") return value;
    return ["true", "yes", "1"].includes(String(value).trim().toLowerCase());
  }
  
  const VALID_STATUSES = new Set(["draft", "published", "expired", "archived"]);
  
  export function parseJobJson(rawText) {
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      throw new Error(`That isn't valid JSON (${err.message}).`);
    }
  
    if (Array.isArray(data)) {
      throw new Error(
        "That's a JSON array of multiple jobs — this box fills one job at a time. Paste a single job object instead.",
      );
    }
    if (!data || typeof data !== "object") {
      throw new Error("Expected a JSON object like { \"title\": ..., \"company\": ... }.");
    }
  
    const fields = {};
    const ignoredKeys = [];
  
    for (const [rawKey, rawValue] of Object.entries(data)) {
      if (rawValue === null || rawValue === undefined) continue;
      const field = FIELD_ALIASES[normalizeKey(rawKey)];
      if (!field) {
        ignoredKeys.push(rawKey);
        continue;
      }
  
      if (field === "featured") {
        fields.featured = normalizeBoolean(rawValue);
      } else if (field === "status") {
        const status = String(rawValue).trim().toLowerCase();
        if (VALID_STATUSES.has(status)) fields.status = status;
        else ignoredKeys.push(`status: "${rawValue}" (not a recognized status)`);
      } else if (DATE_FIELDS.has(field)) {
        const normalized = normalizeDate(rawValue);
        if (normalized) fields[field] = normalized;
      } else if (LIST_FIELDS.has(field)) {
        fields[field] = listToText(rawValue, field === "skills" ? "," : "\n");
      } else if (field === "description") {
        fields.description = unescapeLiteralNewlines(rawValue).trim();
      } else {
        fields[field] = unescapeLiteralNewlines(rawValue).trim();
      }
    }
  
    return { fields, filledCount: Object.keys(fields).length, ignoredKeys };
  }