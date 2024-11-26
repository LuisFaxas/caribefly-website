'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'
import { useRouter } from 'next/navigation'
import { destroyCookie, setCookie } from 'nookies'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const tokenResult = await currentUser.getIdTokenResult()
          const token = await currentUser.getIdToken()

          setIsAdmin(!!tokenResult.claims.admin)
          setUser(currentUser)

          setCookie(null, 'firebaseToken', token, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          })
        } catch (error) {
          console.error('Error getting token:', error)
          setUser(null)
          setIsAdmin(false)
          destroyCookie(null, 'firebaseToken')
        }
      } else {
        setUser(null)
        setIsAdmin(false)
        destroyCookie(null, 'firebaseToken')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await auth.signOut()
      destroyCookie(null, 'firebaseToken')
      router.push('/')
      router.refresh() // Force a refresh of the Next.js cache
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
