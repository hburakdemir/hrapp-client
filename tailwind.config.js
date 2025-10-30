// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        segoe: ["Segoe UI", "sans-serif"],
        times: ["'Times New Roman'", "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
         theme1: {
      light: {
        primary: '#222831',
        bgsoft: '#fff',
        bg: '#CBCBCB',
        text: '#222831',
        text2:'#222831'
      },
      dark: {
        primary: '#948979',
        bgsoft: '#393E46',
        bg: '#222831',
        text: '#CBCBCB',
        text2: '#CBCBCB',
      },
    },
    theme2: {
      light: {
        primary: '#2F5755',
        bgsoft: '#5A9690',
        bg: '#F4F4F4',
        text: '#432323',
        text2: '#432323',
      },
      dark: {
        primary: '#F4EEE0',
        bgsoft: '#6D5D6E',
        bg: '#393646',
        text: '#F4F4F4',
        text2: '#F4F4F4',
      },
    },
    theme3: {
      light: {
        primary: '#FB2576',
        bgsoft: '#1D3E53',
        bg: '#FFFFFF',
        text: '#111827',
        text2: '#F4F4F4',
      },
      dark: {
        primary: '#DD105E',
        bgsoft: '#1D3E53',
        bg: '#1F2937',
        text: '#F9FAFB',
        text2: '#F9FAFB',
      },
    },
      },
    },
  },
  plugins: [],
};