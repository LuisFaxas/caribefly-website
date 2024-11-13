import { db } from './firebaseConfig'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore'

// Types
export interface Service {
  id: string
  title: string
  content: string
}

export interface Flight {
  route: string
  price: string
}

export interface Charter {
  id: string
  title: string
  flights: Flight[]
}

// Service operations
export const serviceOperations = {
  async getAll(): Promise<Service[]> {
    const servicesSnapshot = await getDocs(collection(db, 'services'))
    return servicesSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Service
    )
  },

  async getById(id: string): Promise<Service | null> {
    const serviceDoc = await getDoc(doc(db, 'services', id))
    return serviceDoc.exists()
      ? ({ id: serviceDoc.id, ...serviceDoc.data() } as Service)
      : null
  },

  async update(id: string, data: Partial<Service>): Promise<void> {
    await updateDoc(doc(db, 'services', id), data)
  },

  async create(service: Omit<Service, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'services'))
    await setDoc(docRef, service)
    return docRef.id
  },
}

// Charter operations
export const charterOperations = {
  async getAll(): Promise<Charter[]> {
    const chartersSnapshot = await getDocs(collection(db, 'charters'))
    return chartersSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Charter
    )
  },

  async getById(id: string): Promise<Charter | null> {
    const charterDoc = await getDoc(doc(db, 'charters', id))
    return charterDoc.exists()
      ? ({ id: charterDoc.id, ...charterDoc.data() } as Charter)
      : null
  },

  async update(id: string, data: Partial<Charter>): Promise<void> {
    await updateDoc(doc(db, 'charters', id), data)
  },

  async updateFlights(id: string, flights: Flight[]): Promise<void> {
    await updateDoc(doc(db, 'charters', id), { flights })
  },
}
