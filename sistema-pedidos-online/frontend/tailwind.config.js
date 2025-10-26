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
        neon: {
          pink: '#ff00ff',
          blue: '#00ffff',
          green: '#00ff00',
          purple: '#bf00ff',
          orange: '#ff6b00'
        },
        exotic: {
          100: '#0f0f23',
          200: '#1a1a2e',
          300: '#16213e',
          400: '#0f3460',
          500: '#e94560'
        }
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'pulse-glow': {
          '0%': { 
            boxShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #ff00ff',
            opacity: '0.8'
          },
          '100%': { 
            boxShadow: '0 0 30px #00ffff, 0 0 60px #00ffff, 0 0 90px #00ffff',
            opacity: '1'
          },
        }
      },
    },
  },
  plugins: [],
}