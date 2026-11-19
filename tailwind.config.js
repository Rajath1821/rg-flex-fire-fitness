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
        gym: {
          black: '#07090C',
          darker: '#0B0F14',
          dark: '#111720',
          card: '#161F2B',
          cardHover: '#1C2736',
          border: '#223042',
          muted: '#8E9DAF',
          neon: '#00FF66',
          neonGlow: '#00ff6640',
          cyan: '#00F0FF',
          orange: '#FF5E00',
          crimson: '#FF2E5B'
        }
      },
      boxShadow: {
        'neon': '0 0 20px -3px rgba(0, 255, 102, 0.45)',
        'neon-strong': '0 0 35px 2px rgba(0, 255, 102, 0.65)',
        'cyan': '0 0 20px -3px rgba(0, 240, 255, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 255, 102, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 255, 102, 0.7)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    },
  },
  plugins: [],
}
