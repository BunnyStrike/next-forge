import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Desktop App',
  description: 'Built with Next.js 15 and Electron',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='antialiased'>{children}</body>
    </html>
  )
}
