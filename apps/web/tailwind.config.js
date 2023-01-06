/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadein: {
          '0%': { opacity: 0, filter: 'saturate(0)' },
          '50%': { opacity: 1 },
          '100%': { filter: 'saturate(0.8)' },
        },
      },
      animation: {
        fadein: 'fadein 2s ease-in',
      },
      spacing: {
        128: '32rem',
      },
    },
  },
  plugins: [],
};
