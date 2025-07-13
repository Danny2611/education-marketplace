/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Đảm bảo đường dẫn này bao gồm tất cả các tệp có thể chứa class Tailwind
  ],
  variants: {
    extend: {},
  },
   plugins: [require("tailwindcss-animate")],
}
