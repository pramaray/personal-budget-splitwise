/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'px-3', 'px-4', 'py-3', 'py-4', 
    'bg-gray-700', 'bg-gray-800', 
    'text-white', 'text-gray-400', 
    'rounded-lg', 'rounded-2xl', 
    'focus:ring-2', 'focus:ring-green-500'
  ]
}

