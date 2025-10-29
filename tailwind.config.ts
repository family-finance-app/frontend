import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // darkMode: 'class',
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  //       mono: ['var(--font-mono)', 'Menlo', 'Monaco', 'monospace'],
  //       roboto: ['var(--font-roboto)', 'sans-serif'],
  //     },
  //     colors: {
  //       primary: {
  //         50: '#d5f8f1',
  //         100: '#a0e9db',
  //         200: '#88c7bb',
  //         300: '#7cb7ac',
  //         400: '#6da097',
  //         500: '#5b887f',
  //         600: '#496e67',
  //         700: '#37544e',
  //         800: '#243935',
  //         900: '#12201d',
  //         950: '#091311',
  //       },
  //       background: {
  //         50: '#edf2ec',
  //         100: '#d8e2d5',
  //         200: '#bec7bb',
  //         300: '#aeb6ab',
  //         400: '#99a096',
  //         500: '#81877f',
  //         600: '#686d66',
  //         700: '#4e524d',
  //         800: '#353834',
  //         900: '#1c1e1c',
  //         950: '#10110f',
  //       },
  //       // Financial specific colors
  //       success: {
  //         50: '#ecfdf5',
  //         500: '#10b981',
  //         600: '#059669',
  //         700: '#047857',
  //       },
  //       danger: {
  //         50: '#fef2f2',
  //         500: '#ef4444',
  //         600: '#dc2626',
  //         700: '#b91c1c',
  //       },
  //       warning: {
  //         50: '#fffbeb',
  //         500: '#f59e0b',
  //         600: '#d97706',
  //         700: '#b45309',
  //       },
  //       // Brown/earthy tones for danger zones
  //       brown: {
  //         50: '#fdf8f6',
  //         100: '#f2e8e5',
  //         200: '#eaddd7',
  //         300: '#e0cfc5',
  //         400: '#d2bab0',
  //         500: '#b8997a',
  //         600: '#a08568',
  //         700: '#8b6914',
  //         800: '#7c5e10',
  //         900: '#4a3728',
  //         950: '#2d1b16',
  //       },
  //     },
  //     spacing: {
  //       '18': '4.5rem',
  //       '88': '22rem',
  //       '100': '25rem',
  //       '128': '32rem',
  //     },
  //     borderRadius: {
  //       '4xl': '2rem',
  //       '5xl': '2.5rem',
  //     },
  //     boxShadow: {
  //       financial:
  //         '0 4px 6px -1px rgba(91, 136, 127, 0.1), 0 2px 4px -1px rgba(91, 136, 127, 0.06)',
  //       'financial-lg':
  //         '0 10px 15px -3px rgba(91, 136, 127, 0.1), 0 4px 6px -2px rgba(91, 136, 127, 0.05)',
  //       'inset-financial': 'inset 0 2px 4px 0 rgba(91, 136, 127, 0.06)',
  //     },
  //     animation: {
  //       'fade-in': 'fadeIn 0.3s ease-in-out',
  //       'slide-in': 'slideIn 0.3s ease-out',
  //       'scale-in': 'scaleIn 0.2s ease-out',
  //       'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  //       'bounce-gentle': 'bounceGentle 2s infinite',
  //     },
  //     keyframes: {
  //       fadeIn: {
  //         '0%': { opacity: '0' },
  //         '100%': { opacity: '1' },
  //       },
  //       slideIn: {
  //         '0%': { transform: 'translateX(-100%)' },
  //         '100%': { transform: 'translateX(0)' },
  //       },
  //       scaleIn: {
  //         '0%': { transform: 'scale(0.95)', opacity: '0' },
  //         '100%': { transform: 'scale(1)', opacity: '1' },
  //       },
  //       bounceGentle: {
  //         '0%, 100%': {
  //           transform: 'translateY(-5%)',
  //           animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
  //         },
  //         '50%': {
  //           transform: 'translateY(0)',
  //           animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
  //         },
  //       },
  //     },
  //     transitionProperty: {
  //       height: 'height',
  //       spacing: 'margin, padding',
  //     },
  //     transitionDuration: {
  //       '400': '400ms',
  //       '600': '600ms',
  //     },
  //   },
  // },
  // plugins: [],
};

export default config;
