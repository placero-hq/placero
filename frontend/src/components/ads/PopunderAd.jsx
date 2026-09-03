import { useEffect } from "react";

const SRC = "https://pl30966128.profitableratecpmnetwork.com/53/b9/0b/53b90b8c068b97ee294efb41d4956cd3.js";

// Adsterra recommends exactly one popunder per page. Since this is a single-page
// app, the whole site only ever has one <head>, so we inject the script once on
// first mount of the public shell and never again — this also guards against
// React StrictMode's double-invoke in dev, which would otherwise fire the
// popunder twice on every page load.
let injected = false;

export default function PopunderAd() {
  useEffect(() => {
    if (injected || document.querySelector(`script[src="${SRC}"]`)) return;
    injected = true;
    const script = document.createElement("script");
    script.src = SRC;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return null;
}