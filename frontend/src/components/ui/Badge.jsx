export default function Badge({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "bg-accent-tint text-accent",
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    muted: "bg-gray-100 text-muted",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone] || tones.neutral} ${className}`}>
      {children}
    </span>
  );
}
