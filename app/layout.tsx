// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CaribeFly',
  description: 'Book your flights with ease!',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
