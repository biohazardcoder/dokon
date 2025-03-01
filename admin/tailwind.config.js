/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainText: '#fee9ce',
        mainBg: '#2e3061',
        sidebarBg: '#28293d',
        sidebarText: '#c0c0c0',
        highlight: '#555184  ',
        highlightText: '#ffffff',
        hoverBg: '#37474f',
        hoverText: '#ffffff',
        dashboardBg: 'rgb(222 252 231)',
        accent: '#9997bc '
      },
    },
  },
  plugins: [],
};
