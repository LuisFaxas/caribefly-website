// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata = {
  title: 'CaribeFly',
  description: 'Book your flights with ease!',
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
