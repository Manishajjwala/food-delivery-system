/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          50: '#fff5f0',
          100: '#ffe8db',
          500: '#ff8a5c', // primary buttons
        },
        cream: '#fffdf9',
        warmOrange: '#ff6b35',
        softPink: '#ffc2c2'
      }
    },
  },
  plugins: [],
}
