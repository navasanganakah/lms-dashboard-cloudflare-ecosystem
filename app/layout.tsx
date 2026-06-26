import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; 

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Cloudflare LMS Dashboard',
  description: 'A production-ready Open Source LMS built on Cloudflare Workers with Assets, D1, and Firebase FCM.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans bg-slate-50 text-slate-900`}>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
