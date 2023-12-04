import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/ui/theme-provider"
import { SearchFilterProvider } from '@/context/SearchFilterContext';
import { GeistSans } from 'geist/font/sans';
import Footer from '@/components/ui/Footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CallScribe',
  description: 'CallScribe is an integrated system for call center management, featuring audio file transcription and analysis, data management via a FastAPI backend, and a user-friendly Next.js frontend interface for viewing and interacting with conversation data.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bcg">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="container">
            <SearchFilterProvider>
              {children}
            </SearchFilterProvider>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}