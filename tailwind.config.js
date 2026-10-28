export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#F7F3EC', ivory: '#FAF8F5', forest: '#244230', terra: '#A45731',
        amber: '#D8983C', basalt: '#121A15', muted: '#E7E2D8', line: '#DDD7CB',
        ink: '#182A20', moss: '#586B5F',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      borderRadius: { '3xl': '1.5rem' },
    },
  },
  plugins: [],
}
