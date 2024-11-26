import { validateDestination, validateCharterData } from '../validation'
import type { CharterData } from '@/lib/firestore-utils'

describe('Charter Data Validation', () => {
  const validDestination: CharterData['destinations'][0] = {
    destination: 'MIA-HAV',
    flightDays: ['Monday', 'Thursday'],
    flightTimes: [
      { ida: '10:00', regreso: '14:00' },
      { ida: '11:00', regreso: '15:00' },
    ],
    periods: [
      {
        rt: 500,
        ow: 300,
      },
    ],
  }

  const validCharterData: CharterData = {
    id: 'test-id',
    name: 'Test Charter',
    destinations: [validDestination],
  }

  describe('validateDestination', () => {
    it('should pass validation for valid destination', () => {
      const errors = validateDestination(validDestination)
      expect(errors).toHaveLength(0)
    })

    it('should require destination name', () => {
      const invalidDestination = {
        ...validDestination,
        destination: '',
      }
      const errors = validateDestination(invalidDestination)
      expect(errors).toContainEqual({
        field: 'destination',
        message: 'El destino es requerido',
      })
    })

    it('should require at least one flight day', () => {
      const invalidDestination = {
        ...validDestination,
        flightDays: [],
      }
      const errors = validateDestination(invalidDestination)
      expect(errors).toContainEqual({
        field: 'flightDays',
        message: 'Debe especificar al menos un día de vuelo',
      })
    })

    it('should validate flight times', () => {
      const invalidDestination = {
        ...validDestination,
        flightTimes: [{ ida: '', regreso: '' }],
      }
      const errors = validateDestination(invalidDestination)
      expect(errors).toContainEqual({
        field: 'flightTimes',
        message: 'La hora de ida es requerida',
        path: ['flightTimes', '0', 'ida'],
      })
      expect(errors).toContainEqual({
        field: 'flightTimes',
        message: 'La hora de regreso es requerida',
        path: ['flightTimes', '0', 'regreso'],
      })
    })

    it('should validate price periods', () => {
      const invalidDestination = {
        ...validDestination,
        periods: [
          {
            rt: -100,
            ow: 0,
          },
        ],
      }
      const errors = validateDestination(invalidDestination)
      expect(errors).toContainEqual({
        field: 'periods',
        message: 'El precio R/T debe ser un número positivo',
        path: ['periods', '0', 'rt'],
      })
      expect(errors).toContainEqual({
        field: 'periods',
        message: 'El precio O/W debe ser un número positivo',
        path: ['periods', '0', 'ow'],
      })
    })

    it('should validate profit overrides', () => {
      const invalidDestination = {
        ...validDestination,
        periods: [
          {
            rt: 500,
            ow: 300,
            profitOverride: {
              rt: -50,
              ow: -30,
            },
          },
        ],
      }
      const errors = validateDestination(invalidDestination)
      expect(errors).toContainEqual({
        field: 'periods',
        message: 'La ganancia R/T debe ser un número positivo o cero',
        path: ['periods', '0', 'profitOverride', 'rt'],
      })
      expect(errors).toContainEqual({
        field: 'periods',
        message: 'La ganancia O/W debe ser un número positivo o cero',
        path: ['periods', '0', 'profitOverride', 'ow'],
      })
    })

    it('should validate period dates', () => {
      const invalidDestination = {
        ...validDestination,
        periods: [
          {
            rt: 500,
            ow: 300,
            startDate: '2024-02-01',
            endDate: '2024-01-01',
          },
        ],
      }
      const errors = validateDestination(invalidDestination)
      expect(errors).toContainEqual({
        field: 'periods',
        message: 'La fecha de inicio debe ser anterior a la fecha de fin',
        path: ['periods', '0', 'dates'],
      })
    })
  })

  describe('validateCharterData', () => {
    it('should pass validation for valid charter data', () => {
      const errors = validateCharterData(validCharterData)
      expect(errors).toHaveLength(0)
    })

    it('should require charter name', () => {
      const invalidCharter = {
        ...validCharterData,
        name: '',
      }
      const errors = validateCharterData(invalidCharter)
      expect(errors).toContainEqual({
        field: 'name',
        message: 'El nombre del charter es requerido',
      })
    })

    it('should require at least one destination', () => {
      const invalidCharter = {
        ...validCharterData,
        destinations: [],
      }
      const errors = validateCharterData(invalidCharter)
      expect(errors).toContainEqual({
        field: 'destinations',
        message: 'Debe especificar al menos un destino',
      })
    })

    it('should validate nested destinations', () => {
      const invalidCharter = {
        ...validCharterData,
        destinations: [{ ...validDestination, destination: '' }],
      }
      const errors = validateCharterData(invalidCharter)
      expect(errors).toContainEqual({
        field: 'destination',
        message: 'El destino es requerido',
        path: ['destinations', '0'],
      })
    })
  })
})
