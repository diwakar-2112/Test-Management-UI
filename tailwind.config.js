/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Important for manual toggle
  theme: {
    extend: {
      colors: {
        // Semantic Colors mapped to CSS Variables
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          highlight: 'rgb(var(--surface-highlight) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          light: 'rgb(var(--primary-light) / <alpha-value>)',
          fg: 'rgb(var(--primary-fg) / <alpha-value>)',
        },
        text: {
          main: 'rgb(var(--text-main) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          inverse: 'rgb(var(--text-inverse) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
      }
    },
  },
  plugins: [],
}