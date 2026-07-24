import type { Metadata } from 'next';
import { Bricolage_Grotesque, Manrope } from 'next/font/google';
import '@xyflow/react/dist/style.css';
import './globals.css';
import Providers from '@/src/lib/query/Providers';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
});

const cabin = Manrope({
  subsets: ['latin'],
  variable: '--font-cabin',
});

export const metadata: Metadata = {
  title: 'Relic ai ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`} suppressHydrationWarning>
      <body className={`${bricolage.variable} ${cabin.variable} min-h-full flex flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
