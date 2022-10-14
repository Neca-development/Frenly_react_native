/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'main': '#248BF2',
        'white': '#ffffff',
        'gray': '#71747A',
        'light-gray': 'rgba(201, 204, 209, 0.24)',
        'gray-darker': '#81889F',
        'border-color': '#D7DDF3',
        'error': '#FF005C',
        'error-bg': 'rgba(255, 0, 0, 0.1)',
        'light-bg': '#ECF2FF'
      }
    },
    container: {
      center: true,
      padding: 16,
    },
  },
  plugins: [],
}
