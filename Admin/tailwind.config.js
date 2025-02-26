
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
        extend: {
          animation: {
            wiggle: 'wiggle 1s ease-in-out infinite',
          },
          keyframes: {
            wiggle: {
              '0%, 100%': { transform: 'translateX(0)' },
              '50%': { transform: 'translateX(10px)' },
            },
          },
        },
      },
  plugins: [],
}
