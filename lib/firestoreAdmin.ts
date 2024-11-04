import { db } from './firebaseConfig'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from 'firebase/firestore'

// Initial data for services
const initialServices = [
  { id: 'flights', title: 'Flights', content: '', order: 1 },
  {
    id: 'shipping',
    title: 'Shipping',
    content: 'Send packages to Cuba easily.',
    order: 2,
  },
  {
    id: 'rentals',
    title: 'Car Rentals',
    content: 'Book the best rental cars.',
    order: 3,
  },
  {
    id: 'hotels',
    title: 'Hotels',
    content: 'Find affordable hotels in Cuba.',
    order: 4,
  },
  {
    id: 'tours',
    title: 'Tours',
    content: 'Discover exciting tour packages.',
    order: 5,
  },
]

// Initial data for charters
const initialCharters = [
  {
    id: 'xael',
    title: 'XAEL Charters',
    system: 'Airmax',
    active: true,
    flights: [
      { route: 'Miami - Havana (Mon-Thu)', price: '$289', available: true },
      { route: 'Miami - Havana (Fri-Sat)', price: '$319', available: true },
      { route: 'Miami - Camagüey (Fri)', price: '$339', available: true },
      { route: 'One Way (OW): Miami - Cuba', price: '$219', available: true },
    ],
  },
  {
    id: 'cubazul',
    title: 'Cubazul',
    system: 'Airmax',
    active: true,
    flights: [],
  },
  {
    id: 'invicta',
    title: 'Invicta',
    system: 'AirtimeConnect',
    active: true,
    flights: [],
  },
  {
    id: 'havanaair',
    title: 'HavanaAir',
    system: 'AirtimeConnect',
    active: true,
    flights: [],
  },
  {
    id: 'enjoy',
    title: 'Enjoy',
    system: 'Custom',
    active: true,
    flights: [],
  },
]

// Function to initialize Firestore with default data
export async function initializeFirestore() {
  try {
    // Initialize services collection
    const servicesCollection = collection(db, 'services')
    for (const service of initialServices) {
      await setDoc(doc(servicesCollection, service.id), service)
    }

    // Initialize charters collection
    const chartersCollection = collection(db, 'charters')
    for (const charter of initialCharters) {
      await setDoc(doc(chartersCollection, charter.id), charter)
    }

    console.log('Firestore initialized successfully')
  } catch (error) {
    console.error('Error initializing Firestore:', error)
  }
}

// Function to fetch services
export async function fetchServices() {
  const servicesCollection = collection(db, 'services')
  const snapshot = await getDocs(servicesCollection)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Function to fetch charters
export async function fetchCharters() {
  const chartersCollection = collection(db, 'charters')
  const snapshot = await getDocs(chartersCollection)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Function to update a service
export async function updateService(serviceId: string, data: any) {
  const serviceRef = doc(db, 'services', serviceId)
  await updateDoc(serviceRef, data)
}

// Function to update a charter
export async function updateCharter(charterId: string, data: any) {
  const charterRef = doc(db, 'charters', charterId)
  await updateDoc(charterRef, data)
}
