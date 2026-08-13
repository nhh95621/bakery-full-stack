/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      background: "#fbf5eb",
      foreground: "#2b1d18",
      card: "#fffdf9",
      "card-foreground": "#2b1d18",
      muted: "#f0e3d3",
      "muted-foreground": "#735e51",
      accent: "#c9774b",
      "accent-foreground": "#fffaf4",
      border: "#ddc9b8",
      primary: "#3a251d",
      "primary-foreground": "#fff8ef",
      destructive: "#ad4a42",
      paper: "#fbf5eb",
      cocoa: "#3a251d",
      terracotta: "#c9774b",
      gold: "#d6ad73",
      rosewood: "#7a3e32",
      "destructive-foreground": "#ffffff",
      red: {
        600: "#ad4a42",
      },
      orange: {
        50: "#fdf0e1",
        600: "#c9774b",
      },
      amber: {
        200: "#e7c99b",
      },
      rose: {
        500: "#a94e58",
        600: "#8f3944",
      },
      green: {
        700: "#607d58",
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
