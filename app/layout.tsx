import type { Metadata } from 'next';
import './assets/css/global.css';
import { poppins } from './assets/fonts/fonts';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'FamilyFinance',
  description: "Track all your family's expenses conveniently and prettily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
