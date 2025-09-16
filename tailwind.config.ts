import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
        },
        ring: {
          gold: "#D4AF37",
        },
      },
      borderRadius: {
        "2xl": "1rem",
      },
      boxShadow: {
        soft: "0 4px 16px rgba(0, 0, 0, 0.04)",
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: {
          "2xl": "1400px",
        },
      },
    },
  },
  plugins: [],
};

export default config;