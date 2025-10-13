/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        }
      },
      fontFamily: {
        'sans': ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pg-float': 'pg-float 6s ease-in-out infinite',
        'pg-glow': 'pg-glow 2s ease-in-out infinite alternate',
        'pg-slide-in': 'pg-slide-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pg-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
        'pg-glow': {
          'from': { boxShadow: '0 0 20px -10px rgb(192 132 252)' },
          'to': { boxShadow: '0 0 25px -5px rgb(192 132 252)' },
        },
        'pg-slide-in': {
          'from': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'pg': '0 8px 32px 0 rgba(124, 58, 237, 0.1)',
        'pg-lg': '0 10px 40px 0 rgba(124, 58, 237, 0.15)',
      }
    },
  },
  plugins: [],
}