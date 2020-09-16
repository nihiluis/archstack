module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: [
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Mulish", "sans-serif"],
      body: ["Mulish", "sans-serif"],
    },
    extend: {
      colors: {
        cyan: "#9cdbff",
        "primary": "#D8D4FF"
      },
      width: {
        96: "24rem",
        128: "32rem",
      },
      margin: {
        96: "24rem",
        128: "32rem",
      },
      sizing: {
        96: "24rem",
        128: "32rem",
      },
    },
  },
  variants: {
    opacity: ["responsive", "hover"],
  },
}
