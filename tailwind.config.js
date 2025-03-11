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
          100: '#D91111',
          200: '#A51717',
          300: '#AC0000',
          400: '#710F0F',
        },
        green: '#307C47',
        yellow: '#D5B345',
      },
    },
  },
  plugins: [],
};
