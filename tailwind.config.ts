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
          gold: "#D4AF37",
          goldDark: "#B4891E",
          beige: "#F4EDE2",
        },
        metal: {
          silver: "#C0C7D0",
          silverLight: "#E5E9EF",
        },
        text: {
          DEFAULT: "#1F2937",
          muted: "#6B7280",
          onGold: "#1F2937",
          onDark: "#FFFFFF",
        },
        ring: {
          gold: "#D4AF37",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.08)",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: { "2xl": "1280px" },
      },
    },
  },
  plugins: [],
};
export default config;