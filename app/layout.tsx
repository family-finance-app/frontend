import type { Metadata } from 'next';
import './assets/css/globals.css';
import { inter, jetbrainsMono, roboto } from './assets/fonts/fonts';
import { Providers } from './providers';

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
      className={`${inter.variable} ${jetbrainsMono.variable} ${roboto.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${inter.className} font-sans antialiased bg-background-50 text-background-900`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
