// app/login/page.tsx
'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebaseConfig'
import { useRouter } from 'next/navigation'
import { setCookie } from 'nookies'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const token = await userCredential.user.getIdToken()

      setCookie(null, 'firebaseToken', token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })

      router.push('/dashboard')
    } catch (error) {
      setError('Invalid email or password. Please try again.')
      console.error('Login error', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
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
        </div>
      </div>
    </div>
  )
}
