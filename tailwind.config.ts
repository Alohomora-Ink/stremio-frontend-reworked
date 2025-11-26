import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import lineclamp from "@tailwindcss/line-clamp";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map Tailwind classes to your CSS variables
        brand: {
          primary: "var(--color-brand-primary)",
          secondary: "var(--color-brand-secondary)",
          accent: "var(--color-brand-accent)",
        },
        glass: {
          border: "var(--color-glass-border)",
          surface: "var(--color-glass-surface)",
          highlight: "var(--color-glass-highlight)",
        }
      },
      aspectRatio: {
        '2/3': '2 / 3',
      },
      transitionDuration: {
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
      }
    },
  },
  plugins: [tailwindcssAnimate, typography, lineclamp],
};

export default config;