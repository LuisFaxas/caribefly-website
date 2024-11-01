// lib/firebaseAdmin.ts
import * as admin from 'firebase-admin'
import serviceAccount from '../caribefly-5148a-firebase-adminsdk-75ry4-1c1090f554.json' // Replace with the actual path

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount), // Explicitly cast to admin.ServiceAccount
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // Include project ID explicitly
  })
}

const db = admin.firestore()
const adminAuth = admin.auth()

export { admin, db, adminAuth }
