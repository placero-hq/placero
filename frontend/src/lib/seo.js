// Sets document head tags + JSON-LD from plain JS (no extra SSR/meta library
// needed for a Vite SPA). Called from page components via useEffect.
import { SITE_URL } from "../config/env";

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

function setMeta(id, attr, value) {
  const el = document.getElementById(id);
  if (el && value != null) el.setAttribute(attr, value);
}

/**
 * Sets title, description, canonical, robots and Open Graph/Twitter tags for
 * the current page. Call this from every page's top-level useEffect.
 *
 * @param {object} opts
 * @param {string} [opts.title]
 * @param {string} [opts.description]
 * @param {string} [opts.canonical] - absolute URL
 * @param {string} [opts.image] - absolute URL, defaults to the site OG image
 * @param {"website"|"article"} [opts.type]
 * @param {boolean} [opts.noindex] - set true for admin/login/404/expired pages
 */
export function setPageMeta({ title, description, canonical, image, type = "website", noindex = false }) {
  if (title) {
    document.title = title;
    setMeta("og-title", "content", title);
    setMeta("twitter-title", "content", title);
  }
  if (description) {
    setMeta("meta-description", "content", description);
    setMeta("og-description", "content", description);
    setMeta("twitter-description", "content", description);
  }
  if (canonical) {
    setMeta("canonical-link", "href", canonical);
    setMeta("og-url", "content", canonical);
  }

  const ogImage = image || DEFAULT_OG_IMAGE;
  setMeta("og-image", "content", ogImage);
  setMeta("twitter-image", "content", ogImage);
  setMeta("og-type", "content", type);

  setRobotsMeta(noindex);
}

/**
 * Controls indexability. Call setRobotsMeta(true) on admin routes, the login
 * page, the 404 page, and expired job postings so they never get indexed.
 */
export function setRobotsMeta(noindex) {
  setMeta("meta-robots", "content", noindex ? "noindex, nofollow" : "index, follow");
}

// Maps our free-text jobType values onto schema.org's closed enum. Falls back
// to a sensible default rather than emitting an invalid value.
const EMPLOYMENT_TYPE_MAP = {
  "full-time": "FULL_TIME",
  fulltime: "FULL_TIME",
  "part-time": "PART_TIME",
  parttime: "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
  intern: "INTERN",
  temporary: "TEMPORARY",
  volunteer: "VOLUNTEER",
};

function toEmploymentType(jobType) {
  if (!jobType) return undefined;
  const key = jobType.toLowerCase().replace(/\s+/g, "-");
  return EMPLOYMENT_TYPE_MAP[key] || "FULL_TIME";
}

// ISO 8601 is required by Google for datePosted/validThrough. Job data may
// come from the API as a display string ("12 Jan 2026") or already ISO —
// this normalizes it, and returns undefined (dropped from the JSON-LD)
// rather than emitting a date Google will reject.
function toISODate(value) {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function isJobExpired(job) {
  if (!job?.deadline) return false;
  const d = new Date(job.deadline);
  return !Number.isNaN(d.getTime()) && d.getTime() < Date.now();
}

/**
 * Injects (or removes) JobPosting structured data for Google for Jobs.
 * Intentionally skips injection for expired postings — Google explicitly
 * penalizes sites that leave stale JobPosting markup on pages after the
 * role has closed, so the page should be marked noindex (via setPageMeta)
 * and left without JobPosting JSON-LD instead of emitting a fake future date.
 */
export function setJobPostingJsonLd(job) {
  const existing = document.getElementById("jobposting-jsonld");
  if (existing) existing.remove();
  if (!job || isJobExpired(job)) return;

  const data = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.title,
    identifier: {
      "@type": "PropertyValue",
      name: "PlaceRo",
      value: job.id || job.slug,
    },
    datePosted: toISODate(job.postedAt),
    validThrough: toISODate(job.deadline),
    employmentType: toEmploymentType(job.jobType),
    directApply: Boolean(job.applicationUrl || job.applyUrl),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      logo: job.companyLogo || undefined,
    },
    jobLocationType: job.workMode && job.workMode.toLowerCase() === "remote" ? "TELECOMMUTE" : undefined,
    jobLocation: job.location
      ? {
          "@type": "Place",
          address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "IN" },
        }
      : undefined,
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: { "@type": "QuantitativeValue", value: job.salary, unitText: "MONTH" },
        }
      : undefined,
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "jobposting-jsonld";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}
