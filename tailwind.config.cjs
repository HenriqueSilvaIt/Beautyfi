
/** @type {import('tailwindcss').Config} */

const {colors} = require("./src/styles/colors")

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}",
  "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {colors},
    fontSize: {
        sm: '13px',
        base: '15px',
        lg: '17px',
        xl: '19px',
        '2xl': '22px',
        '3xl': '24px',
        '4xl': '26px',
        '5xl': '28px',
        '6xl': '30px',
      },
      height: {
        button: 57,
      }
  },
  plugins: [],
}

