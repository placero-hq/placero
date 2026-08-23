export default function Button({ as: Tag = "button", variant = "primary", className = "", children, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors";
  const variants = {
    primary: "bg-accent text-white hover:bg-accent-dark",
    secondary: "bg-accent-tint text-accent hover:bg-accent hover:text-white",
    outline: "border border-border-strong text-ink hover:border-accent hover:text-accent",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-muted hover:text-ink",
  };
  return (
    <Tag className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
