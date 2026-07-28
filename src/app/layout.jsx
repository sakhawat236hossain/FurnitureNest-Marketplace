import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import Navbar from './common/Navbar';
import Footer from './common/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'FurnishNest',
  description: 'Premium Furniture Marketplace',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en" 
      
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased` }
    >
      <body className="min-h-full flex flex-col">
        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}