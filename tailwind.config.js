/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, comforting color palette for reduced eye fatigue
        primary: {
          50: '#fef8f0',  // Very light warm cream
          100: '#fdefd9', // Light warm beige
          200: '#fbddb3', // Soft warm tan
          300: '#f7c68c', // Light amber
          400: '#f3a866', // Warm orange
          500: '#e88b42', // Medium warm amber (main brand color)
          600: '#d87228', // Rich amber
          700: '#b85e1d', // Deep warm orange
          800: '#8f4a18', // Dark warm brown
          900: '#663715', // Very dark warm brown
          950: '#3d2310', // Almost black with warm undertone
        },
        warm: {
          // Background neutrals with warm undertones
          50: '#fafaf8',  // Off-white with warmth
          100: '#f5f4f0', // Very light warm gray
          200: '#eae7df', // Light warm gray
          300: '#dad5c8', // Medium warm gray
          400: '#c5bead', // Warm taupe
          500: '#a89985', // Medium warm brown-gray
          600: '#8a7a68', // Warm medium brown
          700: '#6b5e50', // Dark warm brown
          800: '#4d453d', // Very dark warm brown
          900: '#332e29', // Near black with warmth
        },
        accent: {
          // Soft terracotta/coral accent
          50: '#fef6f4',
          100: '#fde9e3',
          200: '#fbd0c5',
          300: '#f7aca0',
          400: '#f28974',
          500: '#e36b51', // Warm terracotta
          600: '#c85437',
          700: '#a4402b',
          800: '#7f3624',
          900: '#5c2b1d',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        // Softer, warmer shadows
        'sm': '0 1px 2px 0 rgba(139, 92, 46, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(139, 92, 46, 0.1), 0 1px 2px -1px rgba(139, 92, 46, 0.1)',
        'md': '0 4px 6px -1px rgba(139, 92, 46, 0.1), 0 2px 4px -2px rgba(139, 92, 46, 0.1)',
        'lg': '0 10px 15px -3px rgba(139, 92, 46, 0.1), 0 4px 6px -4px rgba(139, 92, 46, 0.1)',
        'xl': '0 20px 25px -5px rgba(139, 92, 46, 0.1), 0 8px 10px -6px rgba(139, 92, 46, 0.1)',
      },
      borderRadius: {
        // iOS-style rounded corners
        'ios': '10px',
        'ios-lg': '14px',
        'ios-xl': '18px',
      },
    },
  },
  plugins: [],
}
