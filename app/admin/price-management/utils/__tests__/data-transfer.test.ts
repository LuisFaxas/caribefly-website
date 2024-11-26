import {
  validatePeriod,
  validateFlightTime,
  validateDestination,
  validateCharter,
  exportCharterToJSON,
  importCharterFromJSON,
  migrateCharterData,
} from '../data-transfer'
import type {
  CharterData,
  PeriodData,
  FlightTime,
  DestinationData,
} from '@/types/charter'

describe('Data Transfer Utilities', () => {
  describe('validatePeriod', () => {
    it('should validate a valid period', () => {
      const validPeriod: PeriodData = {
        label: 'High Season',
        rt: 1000,
        ow: 500,
      }
      const result = validatePeriod(validPeriod)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid period', () => {
      const invalidPeriod: PeriodData = {
        label: '',
        rt: -100,
        ow: -50,
      }
      const result = validatePeriod(invalidPeriod)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Period label is required')
      expect(result.errors).toContain(
        'Round trip price must be a positive number'
      )
      expect(result.errors).toContain('One way price must be a positive number')
    })
  })

  describe('validateFlightTime', () => {
    it('should validate a valid flight time', () => {
      const validTime: FlightTime = {
        ida: '10:00',
        regreso: '14:00',
      }
      const result = validateFlightTime(validTime)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid flight time', () => {
      const invalidTime: FlightTime = {
        ida: '',
        regreso: '',
      }
      const result = validateFlightTime(invalidTime)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Departure time is required')
      expect(result.errors).toContain('Return time is required')
    })
  })

  describe('validateDestination', () => {
    it('should validate a valid destination', () => {
      const validDestination: DestinationData = {
        destination: 'MIA-HAV',
        flightDays: ['Monday', 'Wednesday'],
        flightTimes: [{ ida: '10:00', regreso: '14:00' }],
        periods: [
          {
            label: 'High Season',
            rt: 1000,
            ow: 500,
          },
        ],
      }
      const result = validateDestination(validDestination)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid destination', () => {
      const invalidDestination: DestinationData = {
        destination: '',
        flightDays: [],
        flightTimes: [],
        periods: [],
      }
      const result = validateDestination(invalidDestination)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Destination is required')
      expect(result.errors).toContain('At least one flight day is required')
      expect(result.errors).toContain('At least one flight time is required')
      expect(result.errors).toContain('At least one price period is required')
    })
  })

  describe('validateCharter', () => {
    it('should validate a valid charter', () => {
      const validCharter: CharterData = {
        id: 'test-id',
        name: 'Test Charter',
        destinations: [
          {
            destination: 'MIA-HAV',
            flightDays: ['Monday'],
            flightTimes: [{ ida: '10:00', regreso: '14:00' }],
            periods: [
              {
                label: 'High Season',
                rt: 1000,
                ow: 500,
              },
            ],
          },
        ],
      }
      const result = validateCharter(validCharter)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid charter', () => {
      const invalidCharter: CharterData = {
        id: '',
        name: '',
        destinations: [],
      }
      const result = validateCharter(invalidCharter)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Charter ID is required')
      expect(result.errors).toContain('Charter name is required')
      expect(result.errors).toContain('At least one destination is required')
    })
  })

  describe('exportCharterToJSON', () => {
    it('should export charter data to JSON', () => {
      const charter: CharterData = {
        id: 'test-id',
        name: 'Test Charter',
        destinations: [
          {
            destination: 'MIA-HAV',
            flightDays: ['Monday'],
            flightTimes: [{ ida: '10:00', regreso: '14:00' }],
            periods: [
              {
                label: 'High Season',
                rt: 1000,
                ow: 500,
              },
            ],
          },
        ],
      }
      const json = exportCharterToJSON(charter)
      expect(typeof json).toBe('string')
      expect(JSON.parse(json)).toEqual(charter)
    })
  })

  describe('importCharterFromJSON', () => {
    it('should import valid JSON to charter data', () => {
      const charter: CharterData = {
        id: 'test-id',
        name: 'Test Charter',
        destinations: [
          {
            destination: 'MIA-HAV',
            flightDays: ['Monday'],
            flightTimes: [{ ida: '10:00', regreso: '14:00' }],
            periods: [
              {
                label: 'High Season',
                rt: 1000,
                ow: 500,
              },
            ],
          },
        ],
      }
      const json = JSON.stringify(charter)
      const imported = importCharterFromJSON(json)
      expect(imported).toEqual(charter)
    })

    it('should handle invalid JSON', () => {
      expect(() => importCharterFromJSON('invalid-json')).toThrow()
    })

    it('should validate imported data structure', () => {
      const invalidJson = JSON.stringify({ invalid: 'data' })
      expect(() => importCharterFromJSON(invalidJson)).toThrow(
        'Invalid charter data structure'
      )
    })
  })

  describe('migrateCharterData', () => {
    it('should handle data migration', () => {
      const oldData = {
        id: 'test-id',
        name: 'Test Charter',
        destinations: [
          {
            destination: 'MIA-HAV',
            flightDays: ['Monday'],
            flightTimes: [{ ida: '10:00', regreso: '14:00' }],
            periods: [
              {
                label: 'High Season',
                rt: 1000,
                ow: 500,
              },
            ],
          },
        ],
      }
      const migrated = migrateCharterData(oldData)
      expect(migrated).toBeDefined()
      expect(migrated.id).toBe(oldData.id)
      expect(migrated.name).toBe(oldData.name)
    })

    it('should handle missing optional fields', () => {
      const minimalData = {
        id: 'test-id',
        name: 'Test Charter',
        destinations: [],
      }
      const migrated = migrateCharterData(minimalData)
      expect(migrated).toBeDefined()
      expect(migrated.id).toBe(minimalData.id)
    })
  })
})
