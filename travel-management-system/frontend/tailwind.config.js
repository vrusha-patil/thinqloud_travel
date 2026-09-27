/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#064E3B', // Deep Forest Green
          hover: '#022C22',
        },
        secondary: {
          DEFAULT: '#78938A', // Sage Green
          hover: '#5A756C',
        },
        accent: {
          DEFAULT: '#EA580C', // Warm Orange
          hover: '#C2410C',
        },
        background: '#F8F7F2', // Warm off-white
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
