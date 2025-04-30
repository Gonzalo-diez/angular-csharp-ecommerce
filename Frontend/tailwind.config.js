/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'primary': '#1e3a8a',
        'secondary': '#64748b',
        'accent': '#fbbf24',
        'background': '#f3f4f6',
        'text-primary': '#1f2937',
        'text-secondary': '#6b7280',
        'footer-bg': '#111827',
        'footer-text': '#d1d5db',
      }
    },
  },
  plugins: [],
};
