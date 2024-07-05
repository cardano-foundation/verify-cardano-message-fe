/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 45s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "scale(1)" },
          "33%": { transform: "scale(1.1)" },
          "66%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
      },
      fontFamily: {
        sans: ["var(--font-switzer)"],
      },
      fontSize: {
        "cf-sm": "0.875rem", // 14px
        "cf-md": "0.9375rem", // 15px
        "cf-lg": "1.125rem", // 18px
        "cf-xl": "1.25rem", // 20px
        "cf-2xl": "2rem", // 32px
        "cf-3xl": "4rem", // 64px
        "cf-6xl": "5.5rem", // 88px
      },
      lineHeight: {
        "cf-sm": "1.25rem", // 20px
        "cf-md": "1.375rem", // 22px
        "cf-lg": "1.625rem", // 26px
        "cf-xl": "1.75rem", // 28px
        "cf-2xl": "2.375rem", // 38px
        "cf-3xl": "4.75rem", // 76px
        "cf-6xl": "6rem", // 96px
      },
      colors: {
        // brand colours
        "cf-blue": {
          50: "#ADC5FF",
          100: "#6E98FF",
          200: "#3973FF",
          300: "#0D54FF",
          400: "#094BEA",
          500: "#023CC7",
          600: "#0033AD",
          900: "#030321",
        },
        "cf-red": {
          50: "#FFE5E5",
          100: "#FFCFCF",
          200: "#FFAAAA",
          300: "#FF8C8C",
          400: "#FF7878",
          500: "#FF6C6C",
          600: "#FF5454",
        },
        "cf-green": {
          50: "#D1FFF4",
          100: "#A3FAE6",
          200: "#93EFD9",
          300: "#84E1CB",
          400: "#79D3BE",
          500: "#71C7B2",
          600: "#68B8A5",
          700: "#39937f",
        },
        "cf-yellow": {
          50: "#FFF5E4",
          100: "#FEE7C3",
          200: "#FFE0AE",
          300: "#FFD693",
          400: "#FFC668",
          500: "#FEB439",
          600: "#F3A31D",
        },
        // new cf branding
        "cf-background": "#D9D9D9",
        "cf-dark": "#272727",
        "cf-gray": "#404040",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
