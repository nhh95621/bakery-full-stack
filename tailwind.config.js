/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      background: "#ffffff",
      foreground: "#1a1410",
      card: "#ffffff",
      "card-foreground": "#1a1410",
      muted: "#f5f5f4",
      "muted-foreground": "#78716b",
      accent: "#fbbf24",
      "accent-foreground": "#1a1410",
      border: "#e7e5e4",
      primary: "#1a1410",
      "primary-foreground": "#f5f3f0",
      destructive: "#dc2626",
      "destructive-foreground": "#ffffff",
      red: {
        600: "#dc2626",
      },
      orange: {
        50: "#fff7ed",
        600: "#ea580c",
      },
      amber: {
        200: "#fcd34d",
      },
      rose: {
        500: "#f43f5e",
        600: "#e11d48",
      },
      green: {
        700: "#b91c1c",
      },
    },
    fontFamily: {
      serif: ["Bodoni Moda", "serif"],
      sans: ["Inter", "sans-serif"],
    },
    borderRadius: {
      base: "0.5rem",
      lg: "0.5rem",
    },
    extend: {},
  },
  plugins: [],
};
