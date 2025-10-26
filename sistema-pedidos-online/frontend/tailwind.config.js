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
        'exotic': ['Orbitron', 'Rajdhani', 'system-ui']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 2s infinite',
        'matrix': 'matrix 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'text-shine': 'text-shine 3s ease-in-out infinite alternate',
        'slide-rotate': 'slide-rotate 8s linear infinite',
        'border-flow': 'border-flow 3s linear infinite',
        'morph': 'morph 10s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        matrix: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
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
        },
        'slide-rotate': {
          '0%': { transform: 'rotate(0deg) translateX(20px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(20px) rotate(-360deg)' },
        },
        'border-flow': {
          '0%': { 
            'border-image': 'linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff) 1',
            'border-image-slice': '1'
          },
          '100%': { 
            'border-image': 'linear-gradient(270deg, #ff00ff, #00ffff, #ff00ff) 1',
            'border-image-slice': '1'
          },
        },
        morph: {
          '0%': { 
            'border-radius': '60% 40% 30% 70% / 60% 30% 70% 40%',
            'background': 'linear-gradient(45deg, #ff00ff, #00ffff)'
          },
          '50%': { 
            'border-radius': '30% 60% 70% 40% / 50% 60% 30% 60%',
            'background': 'linear-gradient(135deg, #bf00ff, #00ff00)'
          },
          '100%': { 
            'border-radius': '60% 40% 30% 70% / 60% 30% 70% 40%',
            'background': 'linear-gradient(45deg, #ff00ff, #00ffff)'
          },
        }
      },
      backgroundImage: {
        'cyber-grid': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        'circuit-pattern': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23ffffff\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')"
      }
    },
  },
  plugins: [],
}