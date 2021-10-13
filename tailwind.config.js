const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: [
    "./public/**/*.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", ...defaultTheme.fontFamily.sans],
        opensans: ["Open Sans", ...defaultTheme.fontFamily.sans],
      },
    },
    fontSize: {
      xs: ".75rem",
      sm: ".875rem",
      tiny: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.5rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },
    minHeight: {
      0: "0",
      "1/4": "25vh",
      "1/2": "50vh",
      "3/4": "75vh",
      full: "100%",
    },
  },
  variants: {
    extend: {
      visibility: ["hover", "focus", "group-hover", "responsive"],
    },
  },
  plugins: [],
};
