/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'warm-black': {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#c8c8c8',
          400: '#a8a8a8',
          500: '#888888',
          600: '#6d6d6d',
          700: '#5d5d5d',
          800: '#2d2d2d',
          900: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
} 