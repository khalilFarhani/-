import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'قيم وتعلم - منصة التوعية بالنوع الاجتماعي في التعليم',
  description: 'منصة رقمية لمساعدة المعلمين والمعلمات على فهم التصورات الجندرية داخل الفصل وتطوير ممارسات تعليمية عادلة وشاملة.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
