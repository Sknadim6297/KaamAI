/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#8750F7',
        primaryLight: '#A97BFF',
        primaryDark: '#6A3DC5',
        surface: '#FFFFFF',
        surfaceSecondary: '#F5F3FF',
        muted: '#6B7280',
        danger: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
