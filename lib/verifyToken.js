// lib/verifyToken.js

import { adminAuth } from './firebaseAdmin'

export async function verifyIdToken(token) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}
