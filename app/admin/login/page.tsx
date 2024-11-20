// app/admin/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'
import { SessionService } from '@/lib/services/sessionService'
import Link from 'next/link'

const LOGIN_ATTEMPTS_KEY = 'loginAttempts'
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sessionService = SessionService.getInstance()

  const checkLoginAttempts = (): boolean => {
    const attempts = JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{"count": 0}')
    const now = Date.now()

    if (attempts.lockUntil && now < attempts.lockUntil) {
      const remainingMinutes = Math.ceil((attempts.lockUntil - now) / 60000)
      setError(`Too many failed attempts. Please try again in ${remainingMinutes} minutes.`)
      return false
    }

    if (attempts.lockUntil && now >= attempts.lockUntil) {
      // Reset if lockout period is over
      localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify({ count: 0 }))
      return true
    }

    return attempts.count < MAX_LOGIN_ATTEMPTS
  }

  const updateLoginAttempts = (success: boolean) => {
    const attempts = JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{"count": 0}')
    
    if (success) {
      localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify({ count: 0 }))
      return
    }

    const newCount = attempts.count + 1
    if (newCount >= MAX_LOGIN_ATTEMPTS) {
      localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify({
        count: newCount,
        lockUntil: Date.now() + LOCKOUT_DURATION
      }))
    } else {
      localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify({ count: newCount }))
    }
  }

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!checkLoginAttempts()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdTokenResult()

      if (!token.claims.admin) {
        throw new Error('Access denied: Admins only')
      }

      // Create session
      await sessionService.createSession(token.token as any, {
        maxAge: 3600,
        secure: true,
        sameSite: 'strict'
      })

      updateLoginAttempts(true)
      router.push('/admin/dashboard')
    } catch (err) {
      updateLoginAttempts(false)
      setError(err.message === 'Access denied: Admins only' 
        ? err.message 
        : 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <Link
          href="/"
          className="block text-sm text-blue-600 hover:underline mb-4"
        >
          ← Back to Home
        </Link>
        
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Admin Login - <span className="text-blue-600">CaribeFly</span>
        </h2>
        
        <form onSubmit={handleAdminLogin} className="mt-8 space-y-4">
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
              placeholder="admin@example.com"
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
            disabled={loading}
            className="w-full py-3 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {error && (
            <p className="mt-2 text-center text-red-500">{error}</p>
          )}
        </form>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Not an admin?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Regular login
            </Link>
          </p>
          <Link
            href="/signup"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
