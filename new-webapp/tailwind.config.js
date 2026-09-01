/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        // Dark, low-luminance palette for a calibrated reading monitor.
        // No large bright surfaces (see design-research/03-monitor-and-users.md).
        'viewer-bg': '#0a0a0a', // near-black canvas background
        'viewer-chrome': '#141414', // header / action bar
        'viewer-panel': '#1a1a1a', // metadata panel
        'viewer-border': '#2a2a2a',
        'viewer-fg': '#c8c8c8', // muted light-gray text
        'viewer-fg-dim': '#7a7a7a',
        'viewer-accent': '#4a9eff', // used with text/position, never color-only
      },
    },
  },
  plugins: [],
};
