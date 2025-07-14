module.exports = {
  content: [
    "./src/**/*.{tsx,ts,js,jsx,scss,css}",
    "./components/**/*.{tsx,ts,js,jsx}",
    "./layouts/**/*.{tsx,ts,js,jsx}",
    "./pages/**/*.{tsx,ts,js,jsx}",
    "./node_modules/tw-elements/js/**/*.js"
  ],
  theme: {
    extend: {
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(-1rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        reveal: 'reveal 0.3s ease-in',
      },
    },
  },
  darkMode: "class",
  corePlugins:{
    aspectRatio: false,
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