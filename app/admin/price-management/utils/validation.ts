import { CharterData } from '@/types/charter'

export interface ValidationError {
  field: string
  message: string
  path?: string[]
}

export function validateDestination(
  destination: CharterData['destinations'][0]
): ValidationError[] {
  const errors: ValidationError[] = []

  // Validate destination name
  if (!destination.destination) {
    errors.push({
      field: 'destination',
      message: 'El destino es requerido',
    })
  }

  // Validate flight days and times
  if (!destination.flightDays || destination.flightDays.length === 0) {
    errors.push({
      field: 'flightDays',
      message: 'Debe especificar al menos un día de vuelo',
    })
  } else {
    destination.flightDays.forEach((day, index) => {
      if (!day) {
        errors.push({
          field: 'flightDays',
          message: 'El día de vuelo no puede estar vacío',
          path: ['flightDays', index.toString()],
        })
      }
    })
  }

  // Validate flight times
  if (!destination.flightTimes || destination.flightTimes.length === 0) {
    errors.push({
      field: 'flightTimes',
      message: 'Debe especificar al menos un horario de vuelo',
    })
  } else {
    destination.flightTimes.forEach((time, index) => {
      if (!time.ida) {
        errors.push({
          field: 'flightTimes',
          message: 'La hora de ida es requerida',
          path: ['flightTimes', index.toString(), 'ida'],
        })
      }
      if (!time.regreso) {
        errors.push({
          field: 'flightTimes',
          message: 'La hora de regreso es requerida',
          path: ['flightTimes', index.toString(), 'regreso'],
        })
      }
    })
  }

  // Validate periods
  if (!destination.periods || destination.periods.length === 0) {
    errors.push({
      field: 'periods',
      message: 'Debe especificar al menos un periodo de precios',
    })
  } else {
    destination.periods.forEach((period, index) => {
      // Validate base prices
      if (typeof period.rt !== 'number' || period.rt <= 0) {
        errors.push({
          field: 'periods',
          message: 'El precio R/T debe ser un número positivo',
          path: ['periods', index.toString(), 'rt'],
        })
      }
      if (typeof period.ow !== 'number' || period.ow <= 0) {
        errors.push({
          field: 'periods',
          message: 'El precio O/W debe ser un número positivo',
          path: ['periods', index.toString(), 'ow'],
        })
      }

      // Validate profit overrides if present
      if (period.profitOverride) {
        if (
          period.profitOverride.rt &&
          (typeof period.profitOverride.rt !== 'number' ||
            period.profitOverride.rt < 0)
        ) {
          errors.push({
            field: 'periods',
            message: 'La ganancia R/T debe ser un número positivo o cero',
            path: ['periods', index.toString(), 'profitOverride', 'rt'],
          })
        }
        if (
          period.profitOverride.ow &&
          (typeof period.profitOverride.ow !== 'number' ||
            period.profitOverride.ow < 0)
        ) {
          errors.push({
            field: 'periods',
            message: 'La ganancia O/W debe ser un número positivo o cero',
            path: ['periods', index.toString(), 'profitOverride', 'ow'],
          })
        }
      }

      // Validate dates if present
      if (period.startDate && period.endDate) {
        const start = new Date(period.startDate)
        const end = new Date(period.endDate)
        if (start > end) {
          errors.push({
            field: 'periods',
            message: 'La fecha de inicio debe ser anterior a la fecha de fin',
            path: ['periods', index.toString(), 'dates'],
          })
        }
      }
    })
  }

  return errors
}

export function validateCharterData(data: CharterData): ValidationError[] {
  const errors: ValidationError[] = []

  // Validate charter name
  if (!data.name) {
    errors.push({
      field: 'name',
      message: 'El nombre del charter es requerido',
    })
  }

  // Validate destinations
  if (!data.destinations || data.destinations.length === 0) {
    errors.push({
      field: 'destinations',
      message: 'Debe especificar al menos un destino',
    })
  } else {
    data.destinations.forEach((destination, index) => {
      const destinationErrors = validateDestination(destination)
      if (destinationErrors.length > 0) {
        errors.push(
          ...destinationErrors.map((error) => ({
            ...error,
            path: ['destinations', index.toString(), ...(error.path || [])],
          }))
        )
      }
    })
  }

  return errors
}
