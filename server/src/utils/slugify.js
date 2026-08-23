function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Builds a unique slug for a job by checking against existing rows.
 * `checkExists(slug)` should return a boolean; `excludeId` skips a row's own slug on update.
 */
async function buildUniqueSlug({ title, company, checkExists }) {
  const base = slugify(`${title} ${company || ""}`) || "job";
  let candidate = base;
  let suffix = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await checkExists(candidate)) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  return candidate;
}

module.exports = { slugify, buildUniqueSlug };
