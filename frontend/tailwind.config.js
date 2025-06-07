/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // Custom utility if you want to use in className like bg-hero
        hero: "url('/src/assets/bg-home.png')",
      },
    },
  },
  plugins: [],
}
