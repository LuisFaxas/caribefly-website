'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  // Don't show navigation for auth pages
  if (pathname?.startsWith('/admin/auth')) {
    return <>{children}</>
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Charter Editor', href: '/admin/charter-editor' },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-white">
                  CaribeFly Admin
                </span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${
                          isActive
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        } rounded-md px-3 py-2 text-sm font-medium`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout
