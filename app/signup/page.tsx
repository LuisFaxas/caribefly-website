// app/signup/page.tsx
"use client"

import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebaseConfig'
import { useRouter } from 'next/navigation' // Use next/navigation with App Router

export default function Signup() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (error) {
      console.error('Signup error', error)
    }
  }

  return (
    <form onSubmit={handleSignup} className="flex flex-col items-center space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border px-4 py-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border px-4 py-2"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Sign Up
      </button>
    </form>
  )
}
