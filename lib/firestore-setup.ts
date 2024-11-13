import { db } from './firebaseConfig'
import { collection, addDoc, setDoc, doc } from 'firebase/firestore'

// Initial data for services
const initialServices = [
  { id: 'flights', title: 'Flights', content: '' },
  {
    id: 'shipping',
    title: 'Shipping',
    content: 'Send packages to Cuba easily.',
  },
  {
    id: 'rentals',
    title: 'Car Rentals',
    content: 'Book the best rental cars.',
  },
  {
    id: 'hotels',
    title: 'Hotels',
    content: 'Find affordable hotels in Cuba.',
  },
  {
    id: 'tours',
    title: 'Tours',
    content: 'Discover exciting tour packages.',
  },
]

// Initial data for charters
const initialCharters = [
  {
    id: 'xael',
    title: 'XAEL Charters',
    flights: [
      { route: 'Miami - Havana (Mon-Thu)', price: '$289' },
      { route: 'Miami - Havana (Fri-Sat)', price: '$319' },
      { route: 'Miami - Camagüey (Fri)', price: '$339' },
      { route: 'One Way (OW): Miami - Cuba', price: '$219' },
    ],
  },
  { id: 'cubazul', title: 'Cubazul', flights: [] },
  { id: 'invicta', title: 'Invicta', flights: [] },
  { id: 'havanaair', title: 'HavanaAir', flights: [] },
  { id: 'enjoy', title: 'Enjoy', flights: [] },
]

// Function to initialize Firestore collections
export async function initializeFirestore() {
  try {
    // Initialize services collection
    for (const service of initialServices) {
      await setDoc(doc(db, 'services', service.id), {
        title: service.title,
        content: service.content,
      })
    }

    // Initialize charters collection
    for (const charter of initialCharters) {
      await setDoc(doc(db, 'charters', charter.id), {
        title: charter.title,
        flights: charter.flights,
      })
    }

    console.log('Firestore collections initialized successfully')
  } catch (error) {
    console.error('Error initializing Firestore:', error)
  }
}
