import { Inter, JetBrains_Mono, Roboto } from 'next/font/google';

// Primary font for UI elements - clean and professional
export const inter = Inter({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Monospace font for numbers and financial data
export const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

// Secondary font for headers and important text
export const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

// Export all fonts for easy access
export const fonts = {
  inter,
  jetbrainsMono,
  roboto,
};
