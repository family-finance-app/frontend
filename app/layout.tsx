import type { Metadata } from 'next';
import './assets/css/globals.css';
import { inter, jetbrainsMono, roboto } from './assets/fonts/fonts';
import { GeistSans } from 'geist/font/sans';
import { Providers } from './providers';
import Script from 'next/script';

const blockingSetTheme = `(function() {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();`;

export const metadata: Metadata = {
  title: 'FamilyFinance',
  description:
    "Track all your family's expenses conveniently and professionally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${roboto.variable} ${GeistSans.className} antialised dark:`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Script id="theme-init" strategy="beforeInteractive">
          {blockingSetTheme}
        </Script>
      </head>
      <body
        className={`${inter.className} font-sans antialiased bg-background-50 text-background-900`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
