/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(240, 5%, 84%)',     // Customize this
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(222.2, 84%, 4.9%)',
      },
    },
  },
  plugins: [],
}
