/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      colors: {
        base: '#1E1E2E', // Dark gray for background
        primary: '#3B82F6', // Neon blue for main accents
        secondary: '#11998a', // Teal for secondary accents
        neutral: '#D1D5DB', // Light gray for text
        darkerBase: '#141419',
        lighterBase: '#252537',
        success: '#16a64b'
      },
      fontFamily: { // Import from google fonts in .html file in the header tag
        'Lato': ['Lato', 'sans-serif'], // For title of the blog  
        'Ubuntu': ['Ubuntu', 'sans-serif'],
        'Kanit': ['Kanit', 'sans-serif'],
        'Roboto': ['Roboto Slab', 'serif']
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
      animation: {
        Shake: 'shake 0.3s ease-in-out',
        'Shake-slow': 'shake 1s ease-in-out',
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(6deg)" },
        },
        shake: {
          '0%': { transform: 'translate(0)' },
          '10%': { transform: 'translate(-8px)', borderColor: 'red' },
          '20%': { transform: 'translate(8px)', borderColor: 'red' },
          '30%': { transform: 'translate(-6px)', borderColor: 'red' },
          '40%': { transform: 'translate(6px)', borderColor: 'red' },
          '50%': { transform: 'translate(-4px)', borderColor: 'red' },
          '60%': { transform: 'translate(4px)', borderColor: 'red' },
          '70%': { transform: 'translate(-2px)', borderColor: 'red' },
          '80%': { transform: 'translate(2px)', borderColor: 'red' },
          '90%': { transform: 'translate(0px)', borderColor: 'red' },
          '100%': { transform: 'translate(0)' }
        }
      }
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
