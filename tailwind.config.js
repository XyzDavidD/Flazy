/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#020314',
        'bg-card': 'rgba(6,9,22,0.8)',
        'text-main': '#F8FAFC',
        'text-soft': '#CBD5E1',
        'text-muted': '#64748B',
        'accent-orange': '#FF8A1F',
        'accent-orange-soft': '#FFB366',
        'accent-red': '#FF4B2B',
        'accent-gold': '#FCD34D',
      },
      animation: {
        'flazy-topbar': 'flazyTopbar 10s ease-in-out infinite alternate',
        'flazy-gradient': 'flazyGradient 6s ease-in-out infinite alternate',
      },
      keyframes: {
        flazyTopbar: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        flazyGradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '50% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}


