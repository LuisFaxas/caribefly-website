const { initializeApp } = require('firebase/app')
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore')
require('dotenv').config({ path: '.env.local' })

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Initial data
const initialServices = [
  {
    id: 'flights',
    data: {
      title: 'Flights',
      content: '',
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'shipping',
    data: {
      title: 'Shipping',
      content: 'Send packages to Cuba easily.',
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'rentals',
    data: {
      title: 'Car Rentals',
      content: 'Book the best rental cars.',
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'hotels',
    data: {
      title: 'Hotels',
      content: 'Find affordable hotels in Cuba.',
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'tours',
    data: {
      title: 'Tours',
      content: 'Discover exciting tour packages.',
      createdAt: new Date().toISOString(),
    },
  },
]

const initialCharters = [
  {
    id: 'xael',
    data: {
      title: 'XAEL Charters',
      flights: [
        { route: 'Miami - Havana (Mon-Thu)', price: '$289' },
        { route: 'Miami - Havana (Fri-Sat)', price: '$319' },
        { route: 'Miami - Camagüey (Fri)', price: '$339' },
        { route: 'One Way (OW): Miami - Cuba', price: '$219' },
      ],
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'cubazul',
    data: {
      title: 'Cubazul',
      flights: [],
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'invicta',
    data: {
      title: 'Invicta',
      flights: [],
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'havanaair',
    data: {
      title: 'HavanaAir',
      flights: [],
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'enjoy',
    data: {
      title: 'Enjoy',
      flights: [],
      createdAt: new Date().toISOString(),
    },
  },
]

async function initializeFirestore() {
  try {
    console.log('Starting Firestore initialization...')

    // Initialize services collection
    console.log('Initializing services...')
    for (const service of initialServices) {
      try {
        await setDoc(doc(db, 'services', service.id), service.data)
        console.log(`✓ Service ${service.id} initialized successfully`)
      } catch (error) {
        console.error(`Error initializing service ${service.id}:`, error)
      }
    }

    // Initialize charters collection
    console.log('\nInitializing charters...')
    for (const charter of initialCharters) {
      try {
        await setDoc(doc(db, 'charters', charter.id), charter.data)
        console.log(`✓ Charter ${charter.id} initialized successfully`)
      } catch (error) {
        console.error(`Error initializing charter ${charter.id}:`, error)
      }
    }

    console.log('\n✓ Firestore collections initialized successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error initializing Firestore:', error)
    process.exit(1)
  }
}

// Verify environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
]

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
)

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars)
  process.exit(1)
}

// Run initialization
console.log('Firebase Config:', firebaseConfig)
initializeFirestore()
