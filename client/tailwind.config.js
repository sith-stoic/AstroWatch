/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy used for the sidebar + high-emphasis text accents
        navy: {
          950: '#0B1120',
          900: '#101B36',
          800: '#16213E',
          700: '#1E2A4A',
        },
        // Primary blue - buttons, links, active states
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
        },
        // Soft sky-blue used for light accents / hero panels
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          400: '#38BDF8',
        },
        // Used sparingly - a single extra accent for variety (data viz / highlights)
        accent: {
          cyan: '#06B6D4',
          violet: '#7C6FF0',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.035), 0 8px 24px rgba(15, 23, 42, 0.055)',
        'card-hover': '0 2px 4px rgba(15, 23, 42, 0.04), 0 14px 32px rgba(15, 23, 42, 0.09)',
        popover: '0 14px 38px rgba(15, 23, 42, 0.16)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
};
