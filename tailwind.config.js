/** @type {import('tailwindcss').Config} */

// Every themeable color is a CSS variable holding space-separated RGB channels,
// so `<alpha-value>` keeps Tailwind's opacity modifiers (text-ink/70) working.
// Swapping themes is therefore a single variable flip on <html data-theme> —
// no duplicated `dark:` utilities in the stylesheet, one repaint at runtime.
const themed = (variable) => `rgb(var(${variable}) / <alpha-value>)`

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // Escape hatch for the rare rule that needs a genuinely different treatment
  // per theme rather than an inverted token.
  darkMode: ['selector', '[data-theme="dark"]'],
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
        // Text, borders and rules. Black in light, near-white in dark.
        ink: themed('--ink'),
        // Raised surfaces: cards, header, footer. White in light, charcoal in dark.
        paper: themed('--paper'),
        // The page behind those surfaces.
        canvas: themed('--canvas'),
        // Brand yellow — identical in both themes, so anything sitting on it
        // must use `on-accent` rather than `ink` to stay legible.
        accent: themed('--accent'),
        'accent-strong': themed('--accent-strong'),
        'on-accent': themed('--on-accent'),
        // Terminal panels stay dark in both themes by design.
        terminal: '#000000',
      },
      boxShadow: {
        card: '4px 4px 0 rgb(var(--shadow))',
        'card-hover': '6px 6px 0 rgb(var(--shadow))',
        'card-sm': '2px 2px 0 rgb(var(--shadow))',
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
