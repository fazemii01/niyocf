/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        history: "url('/public/assets/images/or2.png')",
        main: "url('/public/assets/images/or2.png')",
        profile: "url('/public/assets/images/bg2.jpeg')",
        cart: "url('/public/assets/images/or2.png')",
      },
      fontFamily: {
        "lobster-two": ['"Lobster Two"', "cursive"],
      },
      boxShadow: {
        primary: "0px 6px 20px 0px #00000020;",
      },
      spacing: {
        22: "7rem",
      },
      colors: {
        primary: "#4F5665",
        "primary-context": "#ffffff",
        secondary: "#949494",
        "secondary-200": "#ffffff",
        tertiary: "#010F1C",
        quartenary: "#0b132a",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
  daisyui: {
    themes: [
      {
        niyocf: {
          primary: "#6A4029",
          secondary: "#949494",
          accent: "#0b132a",
          neutral: "#9f9f9f",
          "base-100": "#fff",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
          "plain-white": "#FFF",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
