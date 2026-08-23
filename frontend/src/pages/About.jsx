import { useEffect } from "react";
import { setPageMeta } from "../lib/seo";
import { SITE_URL } from "../config/env";

export default function About() {
  useEffect(() => {
    setPageMeta({
      title: "About — PlaceRo",
      description: "PlaceRo curates jobs, internships and fresher openings from across the web, so you don't have to search everywhere.",
      canonical: `${SITE_URL}/about`,
    });
  }, []);
  return (
    <div className="container-page py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">About PlaceRo</h1>
      <p className="text-sm text-muted leading-relaxed">
        PlaceRo curates jobs, internships and fresher openings from across the web, so you don't have to search everywhere.
      </p>
    </div>
  );
}
