import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { config } from 'dotenv'
import { cert, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '../.env.local') })

// Initialize Firebase Admin with service account
const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// Initialize the app
initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.projectId
})

async function setAdminClaim() {
  try {
    const userEmail = 'ventas@caribefly.com'
    const auth = getAuth()
    
    // Get the user by email
    const user = await auth.getUserByEmail(userEmail)
    
    // Set admin claim
    await auth.setCustomUserClaims(user.uid, { admin: true })
    
    console.log(`Successfully set admin claim for user: ${userEmail}`)
    process.exit(0)
  } catch (error) {
    console.error('Error setting admin claim:', error)
    process.exit(1)
  }
}

// Run the function
setAdminClaim()
