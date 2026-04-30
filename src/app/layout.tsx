import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import PedagogicalBackground from '@/components/PedagogicalBackground';
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
    <html lang="ar" dir="rtl" suppressHydrationWarning translate="no">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.onerror = function(msg, url, line, col, error) {
              alert("Error: " + msg + "\\nLine: " + line);
              return false;
            };
            window.addEventListener('unhandledrejection', function(event) {
              alert("Unhandled Promise Rejection: " + event.reason);
            });
          `
        }} />
      </head>
      <body className={`${inter.className} notranslate`}>
        <ThemeProvider>
          <PedagogicalBackground />
          <div className="min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
