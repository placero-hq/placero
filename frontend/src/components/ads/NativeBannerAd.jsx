import { useEffect, useRef } from "react";

const CONTAINER_ID = "container-f77aa88e6e9cfcef741332ee7c556c7b";
const SRC = "https://pl30966129.profitableratecpmnetwork.com/f77aa88e6e9cfcef741332ee7c556c7b/invoke.js";

// Native Banner is meant to live in the page body. It's a script that finds
// its matching container div by id and fills it in, so we render the empty
// container ourselves and only inject the script once that div actually
// exists in the DOM.
export default function NativeBannerAd() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = SRC;
    containerRef.current?.appendChild(script);
  }, []);

  return (
    <div className="my-6">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted/70">
        Advertisement
      </p>
      <div id={CONTAINER_ID} ref={containerRef} />
    </div>
  );
}