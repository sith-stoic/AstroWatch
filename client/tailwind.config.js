/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060810',
          900: '#0A0D16',
          800: '#101522',
          700: '#171D2D',
          600: '#222A3D',
        },
        primary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        surface: {
          950: '#070A12',
          900: '#0D111B',
          800: '#121827',
          700: '#1A2233',
          600: '#263047',
        },
        cream: {
          50: '#FCFAF5',
          100: '#F6F1E7',
          200: '#EDE4D6',
          300: '#E0D2BF',
        },
        accent: {
          cyan: '#22D3EE',
          violet: '#A78BFA',
          amber: '#FBBF24',
          rose: '#FB7185',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 45px rgba(0, 0, 0, 0.24)',
        'card-hover': '0 24px 60px rgba(0, 0, 0, 0.34)',
        popover: '0 24px 70px rgba(0, 0, 0, 0.42)',
        glow: '0 0 40px rgba(139, 92, 246, 0.16)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
};
