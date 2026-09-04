import { useEffect } from "react";

const SRC = "https://pl30966128.profitableratecpmnetwork.com/53/b9/0b/53b90b8c068b97ee294efb41d4956cd3.js";

// How often a visitor is allowed to trigger the popunder. The script itself
// fires on the *first click anywhere on the page*, so the only way to cap
// frequency is to control whether we inject the script at all.
const COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours
const STORAGE_KEY = "popunder_last_shown";

// Adsterra recommends exactly one popunder per page. Since this is a single-page
// app, the whole site only ever has one <head>, so we inject the script at most
// once per mount of the public shell — this also guards against React
// StrictMode's double-invoke in dev, which would otherwise fire the popunder
// twice on the same load.
let injectedThisSession = false;

function withinCooldown() {
  const last = Number(localStorage.getItem(STORAGE_KEY));
  return Number.isFinite(last) && Date.now() - last < COOLDOWN_MS;
}

export default function PopunderAd() {
  useEffect(() => {
    if (
      injectedThisSession ||
      document.querySelector(`script[src="${SRC}"]`) ||
      withinCooldown()
    ) {
      return;
    }

    injectedThisSession = true;
    localStorage.setItem(STORAGE_KEY, String(Date.now()));

    const script = document.createElement("script");
    script.src = SRC;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return null;
}