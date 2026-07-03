import type { Metadata } from 'next';
import { Bricolage_Grotesque, Outfit } from 'next/font/google';
import '@xyflow/react/dist/style.css';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
});

const cabin = Outfit({
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
      <body className={`${bricolage.variable} ${cabin.variable} min-h-full flex flex-col`}>{children} </body>
    </html>
  );
}
