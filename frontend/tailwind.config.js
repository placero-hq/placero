/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        colors: {
          bg: "#fdfdfc",
          surface: "#ffffff",
          ink: "#0b0e14",
          muted: "#6b7280",
          "muted-light": "#9aa1ac",
          accent: "#004aad",
          "accent-dark": "#003580",
          "accent-tint": "#eef3fc",
          border: "#e7e8ec",
          "border-strong": "#d7d9de",
        },
        fontFamily: {
          sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        },
        boxShadow: {
          sm2: "0 1px 2px rgba(11,14,20,0.04)",
          md2: "0 6px 20px rgba(11,14,20,0.06)",
        },
        maxWidth: { container: "1120px" },
      },
    },
    plugins: [],
  };
  