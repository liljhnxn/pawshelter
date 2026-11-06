import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFBF7",
          100: "#F7F3EA",
          200: "#EFE8DA",
          300: "#E1D5BF",
          400: "#CFC0A3",
          500: "#FAF7F2",
        },
        forest: {
          50: "#EBF3ED",
          100: "#D3E5D8",
          200: "#ABD0B5",
          300: "#7DB68D",
          400: "#4D9561",
          500: "#2D5A3F",
          600: "#244A33",
          700: "#1E3A2B",
          800: "#162D21",
          900: "#0F2017",
        },
        warmBrown: {
          50: "#FAF6F2",
          100: "#F1E7DD",
          200: "#E2CFBC",
          300: "#D0B397",
          400: "#B88F6E",
          500: "#8B5E3C",
          600: "#734C2F",
          700: "#5B3B24",
          800: "#452C1B",
          900: "#311F13",
        },
        terracotta: {
          50: "#FDF4F1",
          100: "#FCE5DE",
          200: "#F9CBBF",
          300: "#F4A694",
          400: "#EC7E66",
          500: "#E07A5F",
          600: "#C95F44",
          700: "#A64730",
          800: "#863926",
          900: "#6B3122",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(30, 58, 43, 0.06)",
        card: "0 10px 30px -4px rgba(30, 58, 43, 0.08)",
        modal: "0 20px 40px -6px rgba(30, 58, 43, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
