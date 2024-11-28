// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CaribeFly',
  description: 'Book your flights with ease!',
  metadataBase: new URL('http://localhost:3000'),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
