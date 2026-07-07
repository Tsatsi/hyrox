/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        hyrox: {
          orange: '#FF6B00',
          dark: '#0A0A0A',
          card: '#141414',
          border: '#2A2A2A',
        },
      },
    },
  },
  plugins: [],
}
