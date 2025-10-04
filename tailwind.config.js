/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#020204", // darkest background
        secondary: "#0a1f2d", // secondary dark background
        text: "#babab8", // main text color
        icon: "rgb(26, 86, 126)", // icon color
      },
      fontFamily: {
        atkinson: ["Atkinson Hyperlegible", "sans-serif"],
      },
    },
  },
  plugins: [],
};
