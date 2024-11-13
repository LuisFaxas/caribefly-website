import { initializeFirestore } from '../lib/firestore-setup'

async function runInitialization() {
  try {
    await initializeFirestore()
    process.exit(0)
  } catch (error) {
    console.error('Initialization failed:', error)
    process.exit(1)
  }
}

runInitialization()
