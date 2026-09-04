import { useEffect } from "react";

const SRC = "https://pl30966130.profitableratecpmnetwork.com/94/bd/4b/94bd4b1ae9934d6506f9f2c45185a12c.js";

// Adsterra asks for this to sit right above </body>. We only have one real
// </body> for the whole SPA, so — same as PopunderAd — inject it once,
// site-wide, guarded against duplicates.
let injected = false;

export default function SocialBarAd() {
  useEffect(() => {
    if (injected || document.querySelector(`script[src="${SRC}"]`)) return;
    injected = true;
    const script = document.createElement("script");
    script.src = SRC;
    document.body.appendChild(script);
  }, []);

  return null;
}