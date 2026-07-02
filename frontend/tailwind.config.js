/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta del handoff de Claude Design (verde TecniHogar)
        green: {
          50: '#EAF3DE',
          100: '#C0DD97',
          200: '#A5CE6E',
          300: '#7FB13C',
          400: '#5C9220',
          500: '#4A7D18',
          600: '#3B6D11',
          700: '#31600D',
          800: '#27500A',
          900: '#173404',
        },
        blue: {
          50: '#E6F1FB',
          100: '#C4DDF3',
          500: '#185FA5',
          600: '#134E88',
        },
        rose: {
          50: '#FBEAF0',
          500: '#993556',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
