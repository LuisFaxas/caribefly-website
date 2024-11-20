'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const router = useRouter()

  return (
    <header
      className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-4 bg-white shadow-md"
      role="banner"
    >
      <h1 className="text-2xl font-bold text-blue-600 text-center md:text-left">
        <Link
          href="/"
          className="hover:text-blue-700 transition"
          aria-label="CaribeFly Home"
        >
          CaribeFly
        </Link>
      </h1>
      <nav
        className="mt-2 md:mt-0 space-x-2 flex justify-center"
        role="navigation"
      >
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
          aria-label="Log in to your account"
        >
          Log In
        </button>
        <button
          onClick={() => router.push('/signup')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          aria-label="Create a new account"
        >
          Sign Up
        </button>
      </nav>
    </header>
  )
}
