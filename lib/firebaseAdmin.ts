// app/lib/firebaseAdmin.ts
import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // Optionally, include databaseURL or other config options
  })
}

const db = admin.firestore()
const adminAuth = admin.auth() // Initialize admin auth

export { admin, db, adminAuth }
