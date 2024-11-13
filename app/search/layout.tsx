'use client'

import Link from 'next/link'

interface SearchLayoutProps {
  children: React.ReactNode
}

export default function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              CaribeFly
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} CaribeFly - Your Travel Partner to Cuba
        </div>
      </footer>
    </div>
  )
}
