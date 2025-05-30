/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FE7743',
        background: '#EFEEEA',
        content: '#273F4F',
        accent: '#8B5CF6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'retro': '2px 2px 0 rgba(0, 0, 0, 0.1)',
        'retro-lg': '4px 4px 0 rgba(0, 0, 0, 0.1)',
        'retro-xl': '6px 6px 0 rgba(0, 0, 0, 0.1)',
        'glow': '0 0 8px rgba(254, 119, 67, 0.6)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        blink: 'blink 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};