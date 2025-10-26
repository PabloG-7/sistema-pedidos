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
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'text-shine': 'text-shine 3s ease-in-out infinite alternate',
      },
      keyframes: {
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
        },
        'text-shine': {
          '0%': { 
            'background-position': '0% 50%',
            'text-shadow': '0 0 10px #ff00ff, 0 0 20px #ff00ff'
          },
          '100%': { 
            'background-position': '100% 50%',
            'text-shadow': '0 0 20px #00ffff, 0 0 40px #00ffff'
          },
        }
      },
      backgroundImage: {
        'cyber-grid': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [],
}