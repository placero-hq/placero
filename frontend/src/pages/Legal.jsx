import { useEffect } from "react";
import { setPageMeta } from "../lib/seo";
import { SITE_URL } from "../config/env";

export default function Legal({ title }) {
  useEffect(() => {
    setPageMeta({
      title: `${title} — PlaceRo`,
      description: `${title} for PlaceRo, a job, internship and fresher-openings listing site.`,
      canonical: `${SITE_URL}${window.location.pathname}`,
    });
  }, [title]);
  return (
    <div className="container-page py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-sm text-muted leading-relaxed">Content coming soon.</p>
    </div>
  );
}
