/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'centaur': ['Centaur', 'Palatino Linotype', 'Book Antiqua', 'Palatino', 'Times New Roman', 'serif'],
        'serif': ['Centaur', 'Palatino Linotype', 'Book Antiqua', 'Palatino', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}