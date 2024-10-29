/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // For Next.js 12 or earlier
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',    // For Next.js 13 with the new App Router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}