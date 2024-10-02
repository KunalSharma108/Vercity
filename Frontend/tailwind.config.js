/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: '#1E1E2E', // Dark gray for background
        primary: '#3B82F6', // Neon blue for main accents
        secondary: '#14B8A6', // Teal for secondary accents
        neutral: '#D1D5DB', // Light gray for text
      },
      fontFamily: {
        'Lato': ['Lato', 'sans-serif'] // Import from google fonts
      },
      boxShadow: {
        'even-sm': '0px 0px 5px rgba(0, 0, 0, 0.2)', // Soft shadow
        'even-md': '0px 0px 10px rgba(0, 0, 0, 0.3)', // Medium shadow
        'even-lg': '0px 0px 15px rgba(0, 0, 0, 0.4)', // Slightly stronger shadow
        'even-xl': '0px 0px 20px rgba(0, 0, 0, 0.5)', // Strong shadow
        'even-2xl': '0px 0px 25px rgba(0, 0, 0, 0.6)', // Very strong shadow
        'even-3xl': '0px 0px 30px rgba(0, 0, 0, 0.7)', // More prominent shadow
        'even-4xl': '0px 0px 35px rgba(0, 0, 0, 0.8)', // Deep shadow
        'even-5xl': '0px 0px 40px rgba(0, 0, 0, 0.9)', // Extremely deep shadow
      },
    },
  },
  safelist: [
    'shadow-even-sm',
    'shadow-even-md',
    'shadow-even-lg',
    'shadow-even-xl',
    'shadow-even-2xl',
    'shadow-even-3xl',
    'shadow-even-4xl',
    'shadow-even-5xl',
  ],
  plugins: [],
};
