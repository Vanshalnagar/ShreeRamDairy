/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'srd-gold': '#C9A227',           // gold/mustard accent text and badges
        'srd-cream': '#FFF8EC',          // warm cream/ivory primary background
        'srd-dark': '#1A1A1A',           // deep black body and headings
        'srd-maroon': '#6B1414',         // deep maroon CTA buttons and text
        'srd-crimson': '#C0392B',        // rich crimson-red hero background
        'srd-logo-bg': '#8B1A1A',        // deep crimson-red logo badge background
        'srd-blush': '#F5C5B0',          // soft pink/blush background for Timeless Treats
        'srd-orange': '#ff8c00',         // keeping secondary accent orange
        'srd-pista': '#1e5a3c'
      },
      fontFamily: {
        'title': ['Playfair Display', 'serif'],
        'script': ['Dancing Script', 'cursive'],
        'body': ['Inter', 'sans-serif']
      },
      borderRadius: {
        'arch': '50% 50% 0 0'
      }
    },
  },
  plugins: [],
}
