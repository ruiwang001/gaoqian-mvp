import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0f172a",
          0: "#1e293b",
          1: "#334155",
          2: "#475569"
        },
        stroke: {
          1: "rgba(255,255,255,0.15)",
          2: "rgba(255,255,255,0.08)",
          3: "rgba(255,255,255,0.04)"
        },
        text: {
          1: "rgba(255,255,255,0.95)",
          2: "rgba(255,255,255,0.80)",
          3: "rgba(255,255,255,0.60)",
          mute: "rgba(255,255,255,0.45)"
        },
        accent: {
          blue: "#60a5fa",
          emerald: "#34d399",
          amber: "#fbbf24",
          purple: "#a78bfa"
        }
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px"
      },
      boxShadow: {
        edge: "0 0 0 1px rgba(255,255,255,0.08)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.08)",
        soft: "0 18px 40px rgba(0,0,0,0.40)",
        hover: "0 24px 60px rgba(0,0,0,0.50)",
        glow: "0 0 0 1px rgba(52,211,153,0.20), 0 0 24px rgba(52,211,153,0.25)"
      }
    }
  },
  plugins: []
} satisfies Config;
