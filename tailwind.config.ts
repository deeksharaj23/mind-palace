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
        palace: {
          dark: "#050510",
          darker: "#030308",
          blue: "#3b82f6",
          purple: "#8b5cf6",
          violet: "#a78bfa",
          glow: "rgba(139, 92, 246, 0.4)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-constellation":
          "radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 70%)",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        pulse: "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
