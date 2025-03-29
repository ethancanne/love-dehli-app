/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './components/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sf: ['SFPro', 'sans-serif'],
        impact: ['Impact', 'sans-serif'],
        sfBold: ['SFProBold', 'sans-serif'],
        sfLight: ['SFProLight', 'sans-serif'],
        sfHeavy: ['SFProHeavy', 'sans-serif'],
        sfBlack: ['SFProBlack', 'sans-serif'],
        sfSemiBold: ['SFProSemiBold', 'sans-serif'],
        sfRegular: ['SFProRegular', 'sans-serif'],
        sfThin: ['SFProThin', 'sans-serif'],
        sfUltraLight: ['SFProUltraLight', 'sans-serif'],
        sfMedium: ['SFProMedium', 'sans-serif'],
        signPainter: ['SignPainter', 'sans-serif'],
      },
      colors: {
        primary: {
          100: '#E51515',
          200: '#A51717',
          300: '#AC0000',
          400: '#710F0F',
        },
        green: {
          100: '#E3F2E8',
          200: '#C8E4D1',
          300: '#A9D6B9',
          400: '#88C8A1',
          500: '#EEF7F0',
          600: '#307C47',
        },
        yellow: {
          100: '#F8F1D8',
          200: '#D5B345',
        },
      },
    },
  },
  plugins: [],
};
