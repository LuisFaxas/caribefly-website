// app/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../lib/firebaseConfig'

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined) // Add undefined for initial loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser) // Set the user when state changes
    })
    return () => unsubscribe()
  }, [])

  return user
}
