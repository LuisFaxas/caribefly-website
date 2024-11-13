import { db } from '@/lib/firebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'
import type { Charter, SearchParams, FlightAvailability } from '@/types/flight'

class FlightService {
  private cache: Map<string, FlightAvailability> = new Map()

  async searchFlights(params: SearchParams) {
    try {
      // Get all charters
      const chartersRef = collection(db, 'charters')
      const chartersSnap = await getDocs(chartersRef)
      const charters = chartersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Charter[]

      // For each charter, get availability
      const results = await Promise.all(
        charters.map(async (charter) => {
          const availability = await this.getCharterAvailability(
            charter,
            params
          )
          return {
            charter,
            availability,
          }
        })
      )

      return results
    } catch (error) {
      console.error('Error searching flights:', error)
      throw error
    }
  }

  private async getCharterAvailability(
    charter: Charter,
    params: SearchParams
  ): Promise<FlightAvailability | null> {
    // This will be replaced with actual charter system integration
    const cacheKey = `${charter.id}-${params.destination}-${params.departureDate}`

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    // Generate random flight number
    const flightNumber = `${charter.id.toUpperCase()}${Math.floor(
      Math.random() * 1000
    )
      .toString()
      .padStart(3, '0')}`

    // Generate random price
    const basePrice = Math.floor(Math.random() * (400 - 250) + 250)
    const tax = basePrice * 0.0725
    const total = basePrice + tax

    // For now, return dummy data that matches FlightAvailability type
    const availability: FlightAvailability = {
      date: params.departureDate.toISOString(),
      seatsTotal: 10,
      seatsAvailable: Math.floor(Math.random() * 10),
      status: 'AVAILABLE' as const,
      schedule: {
        flightNumber,
        departure: '08:00',
        arrival: '09:30',
      },
      pricing: {
        regular: {
          base: basePrice,
          tax,
          total,
        },
        firstClass: {
          base: basePrice * 1.5,
          tax: basePrice * 1.5 * 0.0725,
          total: basePrice * 1.5 * 1.0725,
        },
      },
    }

    // Update status based on seats available
    if (availability.seatsAvailable === 0) {
      availability.status = 'SOLD_OUT'
    } else if (availability.seatsAvailable <= 3) {
      availability.status = 'LIMITED'
    }

    this.cache.set(cacheKey, availability)
    return availability
  }

  // Add method to clear cache
  clearCache() {
    this.cache.clear()
  }

  // Add method to get cached data
  getCachedData() {
    return Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      value,
    }))
  }
}

export const flightService = new FlightService()
