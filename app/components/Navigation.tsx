'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui'

const Navigation: React.FC = () => {
  return (
    <nav className="flex justify-between items-center w-full px-6 py-4 bg-white/90 backdrop-blur-sm">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        CaribeFly
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/about" className="text-gray-600 hover:text-gray-900">
          About
        </Link>
        <Link href="/contact" className="text-gray-600 hover:text-gray-900">
          Contact
        </Link>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Log In
          </Button>
          <Button size="sm">Sign Up</Button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
