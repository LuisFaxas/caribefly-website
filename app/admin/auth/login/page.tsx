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
      const idTokenResult = await userCredential.user.getIdTokenResult()

      // Check if user has admin claim
      if (!idTokenResult.claims.admin) {
        throw new Error('Access denied: Admin privileges required')
      }
      
      // Create session
      await sessionService.createSession(userCredential.user)

      updateLoginAttempts(true)
      router.push('/admin/dashboard')
    } catch (err: any) {
      updateLoginAttempts(false)
      if (err.message === 'Access denied: Admin privileges required') {
        setError('Access denied: Admin privileges required')
      } else {
        setError('Invalid email or password')
      }
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-800">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-800">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <Link
          href="/"
          className="block text-sm text-indigo-600 hover:underline mb-6"
        >
          ← Back to Home
        </Link>
        
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
        
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/login"
            className="text-sm text-indigo-600 hover:underline"
          >
            Regular User Login
          </Link>
          <Link
            href="/contact"
            className="text-sm text-indigo-600 hover:underline"
          >
            Need Help?
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          This login is for administrators only. Multiple failed attempts will result in a temporary lockout. 
          If you need access, please contact the system administrator.
        </div>
      </div>
    </div>
  )
}
