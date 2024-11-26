import {
  CharterData,
  DestinationData,
  PeriodData,
  FlightTime,
} from '@/types/charter'

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Validation functions
function validatePeriod(period: PeriodData): ValidationResult {
  const errors: string[] = []

  if (!period.label?.trim()) {
    errors.push('Period label is required')
  }
  if (typeof period.rt !== 'number' || period.rt < 0) {
    errors.push('Round trip price must be a positive number')
  }
  if (typeof period.ow !== 'number' || period.ow < 0) {
    errors.push('One way price must be a positive number')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

function validateFlightTime(time: FlightTime): ValidationResult {
  const errors: string[] = []

  if (!time.ida?.trim()) {
    errors.push('Departure time is required')
  }
  if (!time.regreso?.trim()) {
    errors.push('Return time is required')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

function validateDestination(destination: DestinationData): ValidationResult {
  const errors: string[] = []

  if (!destination.destination?.trim()) {
    errors.push('Destination name is required')
  }

  // Validate periods
  destination.periods?.forEach((period, index) => {
    const periodValidation = validatePeriod(period)
    if (!periodValidation.isValid) {
      errors.push(`Period ${index + 1}: ${periodValidation.errors.join(', ')}`)
    }
  })

  // Validate flight times
  destination.flightTimes?.forEach((time, index) => {
    const timeValidation = validateFlightTime(time)
    if (!timeValidation.isValid) {
      errors.push(
        `Flight time ${index + 1}: ${timeValidation.errors.join(', ')}`
      )
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}

function validateCharter(charter: CharterData): ValidationResult {
  const errors: string[] = []

  if (!charter.name?.trim()) {
    errors.push('Charter name is required')
  }

  if (!Array.isArray(charter.destinations)) {
    errors.push('Destinations must be an array')
  } else {
    charter.destinations.forEach((destination, index) => {
      const destinationValidation = validateDestination(destination)
      if (!destinationValidation.isValid) {
        errors.push(
          `Destination ${index + 1}: ${destinationValidation.errors.join(', ')}`
        )
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Export functions
export function exportCharterToJSON(charter: CharterData): string {
  try {
    return JSON.stringify(charter, null, 2)
  } catch (error) {
    throw new Error(
      'Failed to export charter data: ' + (error as Error).message
    )
  }
}

// Import functions
export function importCharterFromJSON(jsonString: string): CharterData {
  try {
    const data = JSON.parse(jsonString) as CharterData
    const validation = validateCharter(data)

    if (!validation.isValid) {
      throw new Error('Invalid charter data: ' + validation.errors.join('; '))
    }

    // Add any missing default values
    return {
      ...data,
      lastUpdated: new Date().toISOString(),
      destinations: data.destinations.map((dest) => ({
        ...dest,
        periods: dest.periods || [],
        flightTimes: dest.flightTimes || [],
        additionalInfo: dest.additionalInfo || '',
      })),
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format: ' + error.message)
    }
    throw error
  }
}

// Migration function for future data structure changes
export function migrateCharterData(charter: CharterData): CharterData {
  // Add migration logic here when needed
  return charter
}
