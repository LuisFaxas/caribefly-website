import { auth } from '@/lib/firebaseConfig'
import { User } from 'firebase/auth'
import { setCookie, destroyCookie } from 'nookies'

export class SessionService {
  private static instance: SessionService

  private constructor() {}

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService()
    }
    return SessionService.instance
  }

  async createSession(user: User): Promise<void> {
    try {
      const token = await user.getIdToken()
      
      // Set session cookie
      setCookie(null, 'session', token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
    } catch (error) {
      console.error('Error creating session:', error)
      throw error
    }
  }

  destroySession(): void {
    try {
      // Sign out from Firebase
      auth.signOut()
      
      // Remove session cookie
      destroyCookie(null, 'session', {
        path: '/',
      })
    } catch (error) {
      console.error('Error destroying session:', error)
      throw error
    }
  }

  async refreshSession(user: User): Promise<void> {
    await this.createSession(user)
  }
}
