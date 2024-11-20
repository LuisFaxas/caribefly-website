import { Timestamp } from 'firebase/firestore'

export interface TabData {
  charters: Charter[]
  promotions: Promotion[]
  announcements: Announcement[]
}

export interface Charter {
  id: string
  title: string
  description: string
  price: number
  origin: string
  destination: string
  departureDate: Timestamp
  returnDate?: Timestamp
  availableSeats: number
  imageUrl?: string
  status: 'active' | 'cancelled' | 'completed'
}

export interface Promotion {
  id: string
  title: string
  description: string
  startDate: Timestamp
  endDate: Timestamp
  discountPercentage: number
  imageUrl?: string
  status: 'active' | 'expired' | 'upcoming'
}

export interface Announcement {
  id: string
  title: string
  content: string
  publishDate: Timestamp
  expiryDate?: Timestamp
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'archived'
}
