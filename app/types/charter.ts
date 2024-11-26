// Charter Data Types
export interface FlightTime {
  ida: string
  regreso: string
}

export interface PeriodData {
  label: string
  startDate: string
  endDate: string
  rt: number
  ow: number
  profitOverride?: {
    rt: number
    ow: number
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
  id: string
  name: string
  agencyLogo?: string
  promotionalImage?: string
  destinations: DestinationData[]
  globalProfit: {
    rt: number
    ow: number
  }
  lastUpdated: string
}

// Validation Types
export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Update Types
export type CharterUpdate = Partial<Omit<CharterData, 'id'>>
export type DestinationUpdate = Partial<DestinationData>
export type PeriodUpdate = Partial<PeriodData>

// Response Types
export interface CharterResponse {
  success: boolean
  data?: CharterData
  error?: string
}

export interface ChartersResponse {
  success: boolean
  data?: CharterData[]
  error?: string
}

// Export all types as a namespace for easier imports
export namespace CharterTypes {
  export type Charter = CharterData
  export type Destination = DestinationData
  export type Period = PeriodData
  export type Flight = FlightTime
  export type Validation = ValidationResult
  export type Error = ValidationError
}
