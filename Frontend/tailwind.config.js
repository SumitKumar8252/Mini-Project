/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Bebas Neue", "sans-serif"],
      },
      colors: {
        gold: {
          400: "#f5d76e",
          500: "#e8c547",
          600: "#c9a832",
        },
      },
    },
  },
  plugins: [],
};