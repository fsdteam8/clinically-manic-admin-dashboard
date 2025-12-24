import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Clinically Manic Admin Dashboard',
    template: '%s | Clinically Manic',
  },
  description:
    'Admin dashboard for managing content, commerce, subscriptions, and users on the Clinically Manic platform.',
  applicationName: 'Clinically Manic',
  generator: 'Next.js',
  keywords: [
    'Clinically Manic',
    'Admin Dashboard',
    'Content Management',
    'E-commerce',
    'Subscriptions',
    'Articles',
    'News',
    'YouTube',
    'Spotify',
  ],
  authors: [{ name: 'Clinically Manic Team' }],
  creator: 'Clinically Manic',
  metadataBase: new URL('https://clinicallymanic.com'),

  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
