// src/types/index.ts

export interface FlightTime {
  ida: string // Departure time
  regreso: string // Return time
}

export interface PeriodData {
  label: string // e.g., "March 1-15", "Holiday Season"
  rt?: number // Round trip base price
  ow?: number // One way base price
  profitOverride?: {
    rt?: number // Optional override for round trip profit
    ow?: number // Optional override for one way profit
  }
}

export interface DestinationData {
  destination: string
  flightDays: string[]
  flightTimes: FlightTime[]
  periods: PeriodData[]
  baggageInfo: string[]
  additionalInfo: string[]
}

export interface CharterData {
  name: string // Charter company name
  destinations: DestinationData[]
}

export interface GlobalProfit {
  rt: number // Default round trip profit
  ow: number // Default one way profit
}

export interface StorageData {
  charters: CharterData[]
  globalProfit: GlobalProfit
  agencyLogo?: string
  promotionalImage?: string
  lastUpdated: string
  selectedDestination: string
  selectedCharterIndex: number
}

// Toast notification type
export type NotificationType = 'success' | 'error' | 'warning'

export interface NotificationData {
  type: NotificationType
  message: string
}

// Price display configuration
export interface PriceDisplayConfig {
  showBase?: boolean // Show base price before profit
  showOverride?: boolean // Show profit override indicators
}

// Chart configuration
export interface ChartConfig {
  charters: CharterData[]
  globalProfit: GlobalProfit
  additionalInfo: string[]
}

// Editor state interface
export interface EditorState {
  selectedDestination: string
  selectedCharterIndex: number
  currentDestinationData?: DestinationData
  isEditing: boolean
}

// File upload configuration
export interface FileUploadConfig {
  accept: string
  maxSize: number
  aspectRatio?: number
}
