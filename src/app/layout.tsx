import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/layout/Navbar';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProJob Copilot — AI-Powered Career Assistant',
  description:
    'Land your dream job faster with AI-powered resume analysis, cover letters, interview coaching, and salary negotiation — all powered by Google Gemini.',
  keywords: ['job search', 'resume analyzer', 'cover letter', 'interview coach', 'AI career', 'Gemini AI'],
  authors: [{ name: 'ProJob Copilot' }],
  metadataBase: new URL('https://projobcopilot.com'),
  openGraph: {
    title: 'ProJob Copilot — AI-Powered Career Assistant',
    description: 'Land your dream job faster with AI-powered career tools.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✨</text></svg>" />
      </head>
      <body className="font-sans bg-[#08080f] text-white antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(15,15,26,0.95)',
              color: '#f1f0ff',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: {
                primary: '#8b5cf6',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
