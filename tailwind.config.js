/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080808',
        charcoal: '#151515',
        line: '#2a2a2a',
        ember: '#FF672F',
        mist: '#A5A5A5',
      },
      fontFamily: {
        display: ['Sora', 'Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
