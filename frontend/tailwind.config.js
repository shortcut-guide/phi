module.exports = {
  contnet:[
    "./src/**/*.{html,js}", 
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
    [animations],
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    require("tw-elements/plugin.cjs"),
    require('@formkit/tailwindcss'),
    require("tailwindcss-radix")(),
    require('tailwindcss-fluid-type'),
    require('tailwindcss-themer'),
    require('tailwindcss-3d'),
    require('tailwindcss-mixins'),
  ],
}