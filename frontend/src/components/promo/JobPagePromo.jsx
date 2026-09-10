// Shown once on every job page. To change the creative or link, edit the
// two values below — nothing else needs to change.
const GIF_SRC = "frontend/public/promo.png"; // put your file in frontend/public/promos/
const LINK = "https://superprofile.bio/vp/ymrGF8SH";
const ALT_TEXT = "Placero Interview Prep Kit";

export default function JobPagePromo() {
  return (
    <div className="my-6 flex justify-center">
      <a
        href={LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full max-w-[360px] overflow-hidden rounded-xl border border-border"
        style={{ aspectRatio: "4 / 5" }}
      >
        <img
          src={GIF_SRC}
          alt={ALT_TEXT}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </a>
    </div>
  );
}