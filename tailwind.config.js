/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sophisticated warm sage/olive palette for reduced eye fatigue
        primary: {
          50: '#f6f8f3',  // Very light sage
          100: '#e8ede2', // Light sage
          200: '#d4ddc9', // Soft sage
          300: '#b8c7a5', // Medium light sage
          400: '#9ab080', // Warm sage
          500: '#7a9860', // Main sage green (brand color)
          600: '#5f7a48', // Deep sage
          700: '#4a5f38', // Dark olive
          800: '#3a4a2d', // Very dark olive
          900: '#2d3823', // Almost black olive
          950: '#1c2316', // Near black with green undertone
        },
        warm: {
          // Neutral backgrounds with subtle warm undertones
          50: '#fafaf9',  // Off-white
          100: '#f5f5f3', // Very light warm gray
          200: '#e8e7e3', // Light warm gray
          300: '#d4d2cb', // Medium warm gray
          400: '#b8b5ac', // Warm taupe
          500: '#9a9689', // Medium gray-brown
          600: '#7a7669', // Warm medium gray
          700: '#5f5c52', // Dark warm gray
          800: '#46443d', // Very dark warm gray
          900: '#2f2e29', // Near black
        },
        accent: {
          // Soft teal accent for contrast with sage
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
        // Softer, more neutral shadows
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.06)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.06)',
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
