/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    borderRadius: {
      DEFAULT: '0',
      none: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '0',
    },
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', '"Courier New"', 'monospace'],
        sans: ['"Space Mono"', '"Courier New"', 'monospace'],
      },
      colors: {
        accent: '#FFE600',
        'accent-dark': '#E6CF00',
      },
      boxShadow: {
        card: '4px 4px 0 #000000',
        'card-hover': '6px 6px 0 #000000',
        'card-sm': '2px 2px 0 #000000',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-2px, -2px)' },
          '80%': { transform: 'translate(2px, 2px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        glitch: 'glitch 0.3s ease-in-out infinite',
        flicker: 'flicker 0.15s ease-in-out 3',
      },
    },
  },
  plugins: [],
}
