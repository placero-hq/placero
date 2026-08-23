import Jobs from "./Jobs";
import { SITE_URL } from "../config/env";

export default function Freshers() {
  return (
    <Jobs
      title="Fresher Jobs"
      filterFn={(j) => j.fresherEligible || (j.experience || "").toLowerCase().includes("fresher")}
      metaTitle="Fresher Jobs — PlaceRo"
      metaDescription="Latest fresher-eligible job openings."
      canonical={`${SITE_URL}/freshers`}
    />
  );
}
