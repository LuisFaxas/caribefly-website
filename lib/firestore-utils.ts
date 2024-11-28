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
  destinations?: Destination[]
  globalProfit?: GlobalProfit
}

export interface DestinationData {
  // Add properties for DestinationData
}

export interface Destination {
  // Add properties for Destination
  periods?: Period[]
}

export interface GlobalProfit {
  // Add properties for GlobalProfit
}

export interface Period {
  // Add properties for Period
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

  async updateDestination(
    charterId: string,
    destinationIndex: number,
    destinationData: Partial<DestinationData>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const charterDoc = await getDoc(doc(db, 'charters', charterId))
      if (!charterDoc.exists()) {
        return { success: false, error: 'Charter not found' }
      }

      const charter = charterDoc.data() as Charter
      if (!charter.destinations || !charter.destinations[destinationIndex]) {
        return { success: false, error: 'Destination not found' }
      }

      // Validate destination data
      const errors = validateDestination({
        ...charter.destinations[destinationIndex],
        ...destinationData,
      })
      if (errors.length > 0) {
        return { success: false, error: errors[0].message }
      }

      // Update destination
      charter.destinations[destinationIndex] = {
        ...charter.destinations[destinationIndex],
        ...destinationData,
      }

      await updateDoc(doc(db, 'charters', charterId), {
        destinations: charter.destinations,
      })
      return { success: true }
    } catch (error) {
      console.error('Error updating destination:', error)
      return { success: false, error: 'Failed to update destination' }
    }
  },

  async updateGlobalProfit(
    charterId: string,
    globalProfit: GlobalProfit
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await updateDoc(doc(db, 'charters', charterId), { globalProfit })
      return { success: true }
    } catch (error) {
      console.error('Error updating global profit:', error)
      return { success: false, error: 'Failed to update global profit' }
    }
  },

  async updatePeriods(
    charterId: string,
    destinationIndex: number,
    periods: Period[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const charterDoc = await getDoc(doc(db, 'charters', charterId))
      if (!charterDoc.exists()) {
        return { success: false, error: 'Charter not found' }
      }

      const charter = charterDoc.data() as Charter
      if (!charter.destinations || !charter.destinations[destinationIndex]) {
        return { success: false, error: 'Destination not found' }
      }

      // Update periods
      charter.destinations[destinationIndex].periods = periods

      await updateDoc(doc(db, 'charters', charterId), {
        destinations: charter.destinations,
      })
      return { success: true }
    } catch (error) {
      console.error('Error updating periods:', error)
      return { success: false, error: 'Failed to update periods' }
    }
  },
}

function validateDestination(
  destination: DestinationData
): { message: string }[] {
  // Implement validation logic for DestinationData
  return []
}
