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
        void: "#030303",
        obsidian: "#0A0A0B",
        ash: "#1A1A1C",
        neon: {
          acid: "#CCFF00",
          cyber: "#00F0FF",
          plasma: "#FF003C",
        },
        metal: {
          DEFAULT: "#E2E2E2",
          dim: "#888888",
        },
      },
      fontFamily: {
        sans: ["var(--font-clash)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "noise": "url('/noise.png')",
        "grid-pattern": "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
      },
      animation: {
        "glitch": "glitch 1s linear infinite",
        "scan": "scan 4s linear infinite",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        glitch: {
          "2%, 64%": { transform: "translate(2px,0) skew(0deg)" },
          "4%, 60%": { transform: "translate(-2px,0) skew(0deg)" },
          "62%": { transform: "translate(0,0) skew(5deg)" },
        },
        scan: {
          "0%": { backgroundPosition: "0 -100vh" },
          "100%": { backgroundPosition: "0 100vh" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
