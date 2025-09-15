// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB",
          lime: "#D3F365",
          orange: "#F59E0B",
          lavender: "#C7C7F9",
          periwinkle: "#D7DBFF",
          peach: "#FFB37B",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          glass: "rgba(255,255,255,0.70)",
        },
        text: {
          DEFAULT: "#0F172A", // primary
          muted: "#475569",   // secondary
          onBrand: "#FFFFFF",
          onLime: "#0F172A",
        },
        border: {
          DEFAULT: "#E5E7EB",
        },
        state: {
          success: "#16A34A",
          warning: "#F59E0B",
          error: "#DC2626",
        },
        ring: {
          blue: "#3B82F6",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.08)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: { "2xl": "1280px" },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
};
export default config;
