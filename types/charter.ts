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
 * @property startDate - Start date in ISO format
 * @property endDate - End date in ISO format
 * @property rt - Round trip base price in USD
 * @property ow - One way base price in USD
 */
export interface Period {
  label: string
  startDate: string
  endDate: string
  rt: number
  ow: number
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
  periods: Period[]
  baggageInfo: string[]
  additionalInfo: string[]
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
 * Charter company information and routes
 * @property id - Unique charter ID
 * @property name - Charter company name
 * @property destinations - Available destinations and their details
 * @property globalProfit - Default profit margins
 */
export interface CharterData {
  id: string
  name: string
  destinations: DestinationData[]
  globalProfit: GlobalProfit
}

/**
 * Charter update data
 * @property name - Optional charter company name update
 * @property destinations - Optional destination updates
 * @property globalProfit - Optional global profit update
 */
export interface CharterUpdate {
  name?: string
  destinations?: Partial<DestinationData>[]
  globalProfit?: GlobalProfit
}

/**
 * Validation error data
 * @property field - Field with error
 * @property message - Error message
 */
export interface ValidationError {
  field: string
  message: string
}

/**
 * Operation result data
 * @property success - Whether operation was successful
 * @property error - Optional error message
 */
export interface OperationResult {
  success: boolean
  error?: string
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

/**
 * Editor storage data
 * @property charters - List of charter companies and their data
 * @property globalProfit - Default profit margins
 * @property agencyLogo - Base64 encoded agency logo
 * @property promotionalImage - Base64 encoded promotional image
 * @property lastUpdated - ISO date string of last update
 */
export interface StorageData {
  charters: CharterData[]
  globalProfit: GlobalProfit
  agencyLogo?: string
  promotionalImage?: string
  lastUpdated: string
}
