const admin = require('firebase-admin')
const serviceAccount = require('./caribefly-5148a-firebase-adminsdk-75ry4-1c1090f554.json') // Update the path

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

async function setAdminRole(uid) {
  try {
    // Set the 'admin' custom claim for the user with the given UID
    await admin.auth().setCustomUserClaims(uid, { admin: true })
    console.log(`Successfully set admin claim for user with UID: ${uid}`)
  } catch (error) {
    console.error('Error setting custom claims:', error)
  }
}

// Run the function with the UID of the user you want to set as an admin
// Replace 'USER_UID' with the actual Firebase UID of the user
setAdminRole('soEdBAe29nP1y0a4Sf1yBeMLn573')
