import type { Metadata } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import '@/styles/index.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Promptimize - AI Code Assistant',
  description: 'The AI prompt optimizer that makes your coding assistant actually understand what you need.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans">
        {children}
        <script id="dhws-errorTracker" src="/dhws-error-tracker.js"></script>
  <script id="dhws-elementInspector" src="/dhws-web-inspector.js"></script>
</body>
    </html>
  );
}