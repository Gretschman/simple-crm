/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sky blue palette for fresh, modern look
        primary: {
          50: '#f0f9ff',  // Very light sky
          100: '#e0f2fe', // Light sky (global background)
          200: '#bae6fd', // Soft sky blue
          300: '#7dd3fc', // Medium light sky
          400: '#38bdf8', // Bright sky
          500: '#0ea5e9', // Main sky blue (brand color)
          600: '#0284c7', // Deep sky
          700: '#0369a1', // Dark blue
          800: '#075985', // Very dark blue
          900: '#0c4a6e', // Deep ocean blue
          950: '#082f49', // Near black with blue undertone
        },
        neutral: {
          // Cool neutral grays
          50: '#fafafa',  // Off-white
          100: '#f5f5f5', // Very light gray
          200: '#e5e5e5', // Light gray
          300: '#d4d4d4', // Medium light gray
          400: '#a3a3a3', // Medium gray
          500: '#737373', // Gray
          600: '#525252', // Dark gray
          700: '#404040', // Darker gray
          800: '#262626', // Very dark gray
          900: '#171717', // Near black
        },
        accent: {
          // Soft teal accent for contrast with sky blue
          50: '#f0faf8',
          100: '#d6f2ed',
          200: '#ade5db',
          300: '#7dd3c5',
          400: '#4fb9ac',
          500: '#329e92', // Soft teal (main accent)
          600: '#287d74',
          700: '#20635d',
          800: '#1a4d49',
          900: '#153a37',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        // iOS 26 prominent multi-layer shadows
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
        'DEFAULT': '0 2px 8px rgba(0, 0, 0, 0.10), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
        'lg': '0 10px 24px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.10)',
        'xl': '0 20px 40px rgba(0, 0, 0, 0.16), 0 8px 16px rgba(0, 0, 0, 0.12)',
        'top': '0 -2px 8px rgba(0, 0, 0, 0.10), 0 -1px 2px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        // iOS-style rounded corners
        'ios': '10px',
        'ios-lg': '14px',
        'ios-xl': '18px',
      },
      height: {
        '18': '72px',
      },
    },
  },
  plugins: [],
}
