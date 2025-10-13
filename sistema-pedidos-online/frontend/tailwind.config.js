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
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'cyber-float': 'cyber-float 6s ease-in-out infinite',
        'cyber-glow': 'cyber-glow 2s ease-in-out infinite alternate',
        'scan-line': 'scan-line 3s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'cyber-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'cyber-glow': {
          'from': { 
            boxShadow: '0 0 20px -5px rgb(34 211 238)',
            borderColor: 'rgb(34 211 238 / 0.3)'
          },
          'to': { 
            boxShadow: '0 0 25px 0px rgb(34 211 238)',
            borderColor: 'rgb(34 211 238 / 0.5)'
          },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}