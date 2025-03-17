module.exports = {
  content: [
    "./src/**/*.{astro,tsx,ts,js,jsx}",
    "./components/**/*.{astro,tsx,ts,js,jsx}",
    "./layouts/**/*.{astro,tsx,ts,js,jsx}",
    "./pages/**/*.{astro,tsx,ts,js,jsx}",
    "./node_modules/tw-elements/js/**/*.js"
  ],
  theme: {
  },
  darkMode: "class",
  corePlugins:{
    aspectRatio: false,
    fontSize: false,
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    require("tw-elements/plugin.cjs"),
    require('@formkit/themes'),
    require("tailwindcss-radix")(),
    require('tailwindcss-fluid-type'),
    require('tailwindcss-themer'),
    require('tailwindcss-3d'),
    require('tailwindcss-mixins'),
  ],
}