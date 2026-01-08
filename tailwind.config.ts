import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      ...defaultTheme.screens,
      // Custom ranges layering atop Tailwind defaults
      s: { max: '599px' },
      m: { min: '600px', max: '1023px' },
      l: { min: '1024px', max: '1535px' },
      xlg: { min: '1536px' },
    },
    extend: {},
  },
  plugins: [],
};

export default config;
