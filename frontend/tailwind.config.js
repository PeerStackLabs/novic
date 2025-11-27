/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0B1F18',
          light: '#1A2F28', // Slightly lighter for hover/cards
        },
        cream: {
          DEFAULT: '#F3E9E0',
          light: '#FDFBF9',
        },
        mint: {
          DEFAULT: '#39D7A9',
          dark: '#2BC095',
        },
        cardbg: '#1A2F28',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
