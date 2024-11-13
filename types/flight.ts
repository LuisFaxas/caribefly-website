export interface FlightRoute {
  from: {
    code: string
    city: string
  }
  to: {
    code: string
    city: string
  }
}

export interface Service {
  id: string
  title: string
  content: string
}

export interface FlightSchedule {
  flightNumber: string
  departure: string
  arrival: string
  daysOfOperation: string[]
}

export interface FlightPrice {
  regular: {
    base: number
    tax: number
    total: number
  }
  firstClass?: {
    base: number
    tax: number
    total: number
  }
}

export interface FlightAvailability {
  date: string
  seatsTotal: number
  seatsAvailable: number
  status: 'AVAILABLE' | 'LIMITED' | 'SOLD_OUT'
  schedule: {
    flightNumber: string
    departure: string
    arrival: string
  }
  pricing: {
    regular: {
      base: number
      tax: number
      total: number
    }
    firstClass?: {
      base: number
      tax: number
      total: number
    }
  }
}

export interface Charter {
  id: string
  title: string
  flights: Flight[]
  system?: string
  routes?: Array<{
    from: {
      code: string
      city: string
    }
    to: {
      code: string
      city: string
    }
  }>
  pricing?: Record<
    string,
    {
      regular: {
        base: number
        tax: number
        total: number
      }
      firstClass?: {
        base: number
        tax: number
        total: number
      }
    }
  >
}

export interface Flight {
  route: string
  price: string
}

export interface SearchParams {
  origin: string
  destination: string
  departureDate: Date
  returnDate?: Date
  passengers: number
  tripType: 'oneway' | 'roundtrip'
}

export interface FilterOptions {
  charter?: string
  maxPrice?: number
  departureTime?: 'morning' | 'afternoon' | 'evening'
  availabilityStatus?: 'AVAILABLE' | 'LIMITED' | 'SOLD_OUT'
}

export type SortOption = 'price' | 'departure' | 'availability' | 'charter'
export type SortDirection = 'asc' | 'desc'
