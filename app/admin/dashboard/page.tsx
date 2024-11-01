// app/admin/dashboard/page.tsx

import { cookies } from 'next/headers' // Import cookies for server-side
import { redirect } from 'next/navigation'
import { verifyIdToken } from '@/lib/verifyToken' // Ensure this is your helper function

export default async function AdminDashboard() {
  // Await the cookies function to retrieve the firebase token
  const cookieStore = await cookies()
  const token = cookieStore.get('firebaseToken')?.value

  // If there's no token, redirect to admin login
  if (!token) {
    redirect('/admin/login')
  }

  // Verify token and check if user is an admin
  try {
    const decodedToken = await verifyIdToken(token)
    if (!decodedToken || !decodedToken.admin) {
      // If user is not an admin, redirect to the main login page
      redirect('/login')
    }
  } catch (error) {
    console.error('Error verifying token:', error)
    redirect('/admin/login') // Redirect if token verification fails
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-4xl text-center mt-8">Admin Dashboard</h1>
      {/* Admin dashboard content goes here */}
    </div>
  )
}
