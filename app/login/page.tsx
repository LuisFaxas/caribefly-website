'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebaseConfig'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { loading } = useAuth()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (error) {
      setError('Invalid email or password. Please try again.')
      console.error('Login error', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <Link
          href="/"
          className="block text-sm text-blue-600 hover:underline mb-4"
        >
          ← Back to Home
        </Link>
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Sign in to <span className="text-blue-600">CaribeFly</span>
        </h2>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>

          {error && <p className="mt-2 text-center text-red-500">{error}</p>}
        </form>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Dont have an account?{' '}
            <a
              href="/signup"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign up
            </a>
          </p>
          <a
            href="/admin/login"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Admin Login
          </a>
        </div>
      </div>
    </div>
  )
}
