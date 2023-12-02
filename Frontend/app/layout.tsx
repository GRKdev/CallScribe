import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/ui/theme-provider"
import { SearchFilterProvider } from '@/context/SearchFilterContext';
import { GeistSans } from 'geist/font/sans';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Call Center',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className='bcg'>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>
            <SearchFilterProvider>
              {children}
            </SearchFilterProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
