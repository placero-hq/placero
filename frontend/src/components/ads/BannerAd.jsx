import { useEffect, useRef } from "react";

const KEY = "d6e3b6a7d317893291eba73dbd711fbc";
const SRC = `https://www.highrevenueformat.com/${KEY}/invoke.js`;

// This unit reads a global `atOptions` object at load time, so it only
// supports one instance per page — fine here since we render it once per
// job page. containerRef scopes the injected <script> to this component
// instance instead of dumping it in <head>/<body>.
export default function BannerAd() {
  const containerRef = useRef(null);

  useEffect(() => {
    window.atOptions = {
      key: KEY,
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };
    const script = document.createElement("script");
    script.src = SRC;
    containerRef.current?.appendChild(script);
  }, []);

  return (
    <div className="my-6 flex flex-col items-center">
      <p className="mb-1.5 self-start text-[10px] font-semibold uppercase tracking-wide text-muted/70">
        Advertisement
      </p>
      <div ref={containerRef} style={{ width: 300, height: 250 }} />
    </div>
  );
}