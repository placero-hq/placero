import Jobs from "./Jobs";
import { SITE_URL } from "../config/env";

export default function Internships() {
  return (
    <Jobs
      title="Internships"
      filterFn={(j) => (j.jobType || "").toLowerCase().includes("intern")}
      metaTitle="Internships — PlaceRo"
      metaDescription="Latest internship openings across companies."
      canonical={`${SITE_URL}/internships`}
    />
  );
}
