import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK
admin.initializeApp()

// Cloud Function to set admin claim
export const addAdminRole = functions.https.onCall(
  async (data: functions.https.CallableRequest<Data>, context) => {
    // Check if the request is coming from an authenticated admin
    if (!context.auth?.token?.admin) {
      return { error: 'Only admins can add other admins' }
    }

    try {
      // Set the admin claim for the specified user UID
      await admin.auth().setCustomUserClaims(data.uid, { admin: true })
      return { message: `Admin claim set for user with UID: ${data.uid}` }
    } catch (error) {
      console.error('Error setting admin claim:', error)
      return { error: 'Failed to set admin claim' }
    }
  }
)
