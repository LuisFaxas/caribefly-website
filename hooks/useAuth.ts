// app/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../lib/firebaseConfig'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null) // Properly typing state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser) // No type errors now!
    })
    return () => unsubscribe()
  }, [])

  return user
}
