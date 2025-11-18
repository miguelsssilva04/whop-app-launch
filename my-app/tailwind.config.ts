/** @type {import('tailwindcss').Config} */
import { frostedThemePlugin } from "@whop/react/tailwind";

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
    plugins: [frostedThemePlugin()],
  theme: {
    extend: {},
  },
}