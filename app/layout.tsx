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
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${roboto.variable} ${GeistSans.className}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <Script id="theme-init" strategy="beforeInteractive">
          {blockingSetTheme}
        </Script>
      </head>
      <body
        className={`${inter.className} font-sans antialiased bg-primary-700/95 dark:bg-primary-800 text-background-900`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
