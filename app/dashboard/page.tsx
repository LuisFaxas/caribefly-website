//app/dashboard/page.tsx
'use client'

import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../lib/firebaseConfig'
import { destroyCookie } from 'nookies'

export default function Dashboard() {
  const user = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      router.push('/login')
    }
  }, [user, router])

  const handleLogout = async () => {
    await signOut(auth)
    destroyCookie(null, 'firebaseToken') // Clear the token
    router.push('/')  // Redirect to home page instead of login
  }

  if (user === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 p-4 text-white text-center">
        <h1 className="text-4xl font-bold">Welcome to your Dashboard</h1>
        <p className="mt-2 text-xl">Hello, {user?.email}</p>
      </div>
      <div className="container mx-auto mt-10 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Profile Overview</h2>
            <p className="text-gray-700">
              This section can display user-specific details in the future.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-700">
              Adjust your account settings here (coming soon).
            </p>
          </div>
        </div>
        <div className="mt-10 text-center">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
