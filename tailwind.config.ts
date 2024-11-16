import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        glow: {
          '0%, 100%': { 
            textShadow: '0 0 10px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.2)'
          },
          '50%': {
            textShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)'
          },
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
