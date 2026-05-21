/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif']
      },
      colors: {
        ink: '#0a0f1e',
        panel: 'rgba(255,255,255,0.04)',
        electric: '#3b82f6',
        cyanlight: '#22d3ee'
      },
      boxShadow: {
        glow: '0 0 30px rgba(59, 130, 246, 0.18)'
      }
    }
  },
  plugins: []
};
