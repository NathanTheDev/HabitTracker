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
        primary: {
          DEFAULT: "#C58D85",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#F5F0EF",
          foreground: "#8A7370",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#3D2B29",
        },
        background: "#FAF7F6",
        foreground: "#3D2B29",
        border: "#EDE5E3",
        ring: "#C58D85",
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
