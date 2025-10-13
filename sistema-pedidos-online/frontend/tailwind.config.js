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
        cyber: {
          cyan: '#00f5ff',
          pink: '#ff0080',
          purple: '#8b5cf6',
          gold: '#ffd700'
        }
      },
      fontFamily: {
        'sans': ['Outfit', 'system-ui', 'sans-serif'],
        'mono': ['Space Grotesk', 'monospace'],
      },
      animation: {
        'float3d': 'float3d 6s ease-in-out infinite',
        'holographic': 'holographic 3s ease-in-out infinite',
        'binary-move': 'binaryMove 20s linear infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'slide-in-luxury': 'slideInLuxury 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
      },
      keyframes: {
        float3d: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotateX(0) rotateY(0)' },
          '33%': { transform: 'translate3d(10px, -10px, 10px) rotateX(5deg) rotateY(5deg)' },
          '66%': { transform: 'translate3d(-5px, 5px, -5px) rotateX(-3deg) rotateY(-3deg)' },
        },
        holographic: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        binaryMove: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100px)' },
        },
        neonPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        slideInLuxury: {
          from: {
            opacity: '0',
            transform: 'translate3d(0, 50px, 0) rotateX(10deg)'
          },
          to: {
            opacity: '1',
            transform: 'translate3d(0, 0, 0) rotateX(0)'
          },
        }
      },
      backdropBlur: {
        'xl': '24px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 245, 255, 0.5)',
        'neon-lg': '0 0 40px rgba(0, 245, 255, 0.7)',
        'neon-pink': '0 0 20px rgba(255, 0, 128, 0.5)',
      }
    },
  },
  plugins: [],
}