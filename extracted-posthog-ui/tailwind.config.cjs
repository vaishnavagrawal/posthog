/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'posthog-blue': '#1d4aff',
        'posthog-cyan': '#00d2ff',
        'posthog-purple': '#6432ff',
        'posthog-indigo': '#4422aa',
        'posthog-green': '#1f9d55',
        'posthog-orange': '#f89c1e',
        'posthog-red': '#f14d4d',
        'posthog-pink': '#ea4a8f',
        'posthog-surface': '#ffffff',
        'posthog-surface-muted': '#f3f4f6',
      }
    },
  },
  plugins: [],
}
