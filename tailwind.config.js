/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: '15px',
      },
    },
    screens: {
      mb: '300px',
      sm: '640px',
      md: '768px',
      lg: '960px',
      xl: '1200px',
      xxl: '1366px',
      xxxl: '1700px',
    },
    extend: {
      boxShadow: {
        'inset-custom': 'inset 0 0 120px #020202BF',
      },
      colors: {
        background: {
          100: '#cccdd0',
          200: '#9a9ba1',
          300: '#676a72',
          400: '#353843',
          500: '#020614',
          600: '#020510',
          700: '#01040c',
          800: '#010208',
          900: '#000104',
        },
        gray: {
          100: '#ebecf0',
          200: '#d7d8e1',
          300: '#c2c5d1',
          400: '#aeb1c2',
          500: '#9a9eb3',
          600: '#7b7e8f',
          700: '#5c5f6b',
          800: '#3e3f48',
          900: '#1f2024',
        },
      },
      backgroundImage: {
        shape: 'url("/shape.svg")',
        circles: 'url("/bg-circles.png")',
        circleStar: 'url("/circle-star.svg")',
        site: 'url("/site-bg4.jpg")',
        'gold-gradient': 'linear-gradient(to right, #A89250, #CFB360)',
      },
      animation: {
        scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
        cubeSpinner: 'cubeSpinner 1.8s ease-in-out infinite',
        shake: 'shake 0.2s ease-in-out infinite',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%, 90%': { transform: 'translate(-2px, 2px)' },
          '20%, 80%': { transform: 'translate(2px, -2px)' },
          '30%, 70%': { transform: 'translate(-2px, -2px)' },
          '40%, 60%': { transform: 'translate(2px, 2px)' },
          '50%': { transform: 'translate(-2px, 2px)' },
        },
        scroll: {
          to: {
            transform: 'translate(calc(-50% - 0.5rem))',
          },
        },
        cubeSpinner: {
          '25%': { transform: 'translateX(22px) rotate(-90deg) scale(0.5)' },
          '50%': { transform: 'translateX(22px) translateY(22px) rotate(-180deg)' },
          '75%': { transform: 'translateX(0) translateY(22px) rotate(-270deg) scale(0.5)' },
          '100%': { transform: 'rotate(-1turn)' },
        },
      },
      fontFamily: {
        lexend: [`var(--font-lexend)`, 'sans-serif'],
      },
    },
  },
  container: {
    padding: {
      DEFAULT: '15px',
    },
  },
  plugins: [require('tailwind-scrollbar'), require('tailwind-scrollbar-hide')],
};
