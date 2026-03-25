import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aguia: {
          primary: "var(--aguia-primary)",
          secondary: "var(--aguia-secondary)",
          accent: "var(--aguia-accent)",
          bg: "var(--aguia-bg)",
          surface: "var(--aguia-surface)",
          "surface-light": "var(--aguia-surface-light)",
          sidebar: "var(--aguia-sidebar)",
          border: "var(--aguia-border)",
        },
        dark: {
          50: "#E2E8F0",
          100: "#CBD5E1",
          200: "#94A3B8",
          300: "#64748B",
          400: "#475569",
          500: "#334155",
          600: "#1E293B",
          700: "#1A2332",
          800: "#111827",
          900: "#0B1120",
        },
      },
      fontFamily: {
        brand: "var(--aguia-font), sans-serif",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
