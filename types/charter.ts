// src/types/index.ts

/**
 * Flight time information for a specific route
 * @property ida - Departure time in 24-hour format (HH:mm)
 * @property regreso - Return time in 24-hour format (HH:mm)
 */
export interface FlightTime {
  ida: string
  regreso: string
}

/**
 * Period-specific pricing and information
 * @property label - Period description (e.g., "March 1-15", "Holiday Season")
 * @property rt - Round trip base price in USD
 * @property ow - One way base price in USD
 * @property profitOverride - Optional profit overrides for this period
 */
export interface PeriodData {
  label: string
  rt?: number
  ow?: number
  profitOverride?: {
    rt?: number
    ow?: number
  }
}

/**
 * Destination-specific information and pricing
 * @property destination - Airport code (e.g., "MIA-HAV")
 * @property flightDays - Days of the week flights operate
 * @property flightTimes - Departure and return times
 * @property periods - Pricing periods
 * @property baggageInfo - Baggage allowance information
 * @property additionalInfo - Additional flight information
 */
export interface DestinationData {
  destination: string
  flightDays: string[]
  flightTimes: FlightTime[]
  periods: PeriodData[]
  baggageInfo: string[]
  additionalInfo: string[]
}

/**
 * Charter company information and routes
 * @property name - Charter company name
 * @property destinations - Available destinations and their details
 */
export interface CharterData {
  name: string
  destinations: DestinationData[]
}

/**
 * Global profit settings
 * @property rt - Default round trip profit margin in USD
 * @property ow - Default one way profit margin in USD
 */
export interface GlobalProfit {
  rt: number
  ow: number
}

/**
 * Editor storage data
 * @property charters - List of charter companies and their data
 * @property globalProfit - Default profit margins
 * @property agencyLogo - Base64 encoded agency logo
 * @property promotionalImage - Base64 encoded promotional image
 * @property lastUpdated - ISO date string of last update
 * @property selectedDestination - Currently selected destination
 * @property selectedCharterIndex - Index of selected charter
 */
export interface StorageData {
  charters: CharterData[]
  globalProfit: GlobalProfit
  agencyLogo?: string
  promotionalImage?: string
  lastUpdated: string
  selectedDestination: string
  selectedCharterIndex: number
}

/**
 * Toast notification type
 */
export type NotificationType = 'success' | 'error' | 'warning'

/**
 * Notification data
 * @property type - Type of notification
 * @property message - Notification message
 */
export interface NotificationData {
  type: NotificationType
  message: string
}

/**
 * Price display configuration
 * @property showBase - Show base price
 * @property showOverride - Show override price
 */
export interface PriceDisplayConfig {
  showBase?: boolean
  showOverride?: boolean
}

/**
 * Chart configuration
 * @property charters - List of charters to display
 * @property globalProfit - Global profit settings
 * @property additionalInfo - Additional information to display
 */
export interface ChartConfig {
  charters: CharterData[]
  globalProfit: GlobalProfit
  additionalInfo: string[]
}

/**
 * Editor state interface
 * @property selectedDestination - Currently selected destination
 * @property selectedCharterIndex - Index of selected charter
 * @property currentDestinationData - Currently selected destination data
 * @property isEditing - Whether editor is in edit mode
 */
export interface EditorState {
  selectedDestination: string
  selectedCharterIndex: number
  currentDestinationData?: DestinationData
  isEditing: boolean
}

/**
 * File upload configuration
 * @property accept - Accepted file types
 * @property maxSize - Maximum file size in bytes
 * @property aspectRatio - Required aspect ratio for images
 */
export interface FileUploadConfig {
  accept: string
  maxSize: number
  aspectRatio?: number
}
