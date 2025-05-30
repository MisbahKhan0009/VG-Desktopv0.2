/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        everforest: {
          dark: {
            bg: '#1E2326',
            card: '#2D353B',
            border: '#475258',
            text: '#D3C6AA',
            accent: {
              red: '#E67E80',
              green: '#A7C080',
              cyan: 'rgb(127 187 179 / <alpha-value>)'
            }
          },
          light: {
            bg: '#F2EFDF',
            card: '#F4F0D9',
            border: '#DDD8BE',
            text: '#5C6A72',
            accent: {
              red: '#F85552',
              green: '#8DA101',
              cyan: 'rgb(58 148 197 / <alpha-value>)'
            }
          }
        }
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'retro': '2px 2px 0 rgba(0, 0, 0, 0.1)',
        'retro-lg': '4px 4px 0 rgba(0, 0, 0, 0.1)',
        'retro-xl': '6px 6px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};