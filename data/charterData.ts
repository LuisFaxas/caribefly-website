import type { CharterData } from '@/types/charter'
import { DEFAULT_INFO } from '@/constants/defaults'

export const initialCharterData: CharterData[] = [
  {
    name: 'Enjoy',
    destinations: [
      {
        destination: 'MIA-HAV',
        flightDays: ['Viernes y Sábado'],
        flightTimes: [
          { ida: '06:00', regreso: '09:30' },
          { ida: '18:00', regreso: '21:30' },
        ],
        periods: [
          {
            label: 'Marzo 1-15',
            rt: 349,
            ow: 269,
            profitOverride: {
              rt: 40,
              ow: 30,
            },
          },
          {
            label: 'Marzo 16-31',
            rt: 399,
            ow: 289,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.40/lb',
          'Maletas adicionales: $2.70/lb',
          'Cargo por chequeo: $26 por pieza',
        ],
        additionalInfo: DEFAULT_INFO,
      },
    ],
  },
  {
    name: 'Xael',
    destinations: [
      {
        destination: 'MIA-HAV',
        flightDays: ['Domingo a Jueves'],
        flightTimes: [
          { ida: '05:45', regreso: '08:00' },
          { ida: '19:30', regreso: '21:30' },
        ],
        periods: [
          {
            label: 'Marzo 1-15',
            rt: 299,
            ow: 229,
          },
          {
            label: 'Marzo 16-31',
            rt: 359,
            ow: 249,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.00/lb',
          'Maletas adicionales: $2.00/lb',
          'Cargo por chequeo: $25 por pieza',
        ],
        additionalInfo: DEFAULT_INFO,
      },
    ],
  },
  {
    name: 'Cubazul',
    destinations: [
      {
        destination: 'MIA-HAV',
        flightDays: ['Lunes a Viernes'],
        flightTimes: [
          { ida: '07:00', regreso: '10:30' },
          { ida: '16:00', regreso: '19:30' },
        ],
        periods: [
          {
            label: 'Marzo 1-15',
            rt: 329,
            ow: 249,
          },
          {
            label: 'Marzo 16-31',
            rt: 379,
            ow: 269,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.20/lb',
          'Maletas adicionales: $2.40/lb',
          'Cargo por chequeo: $25 por pieza',
        ],
        additionalInfo: DEFAULT_INFO,
      },
    ],
  },
  {
    name: 'Invicta',
    destinations: [
      {
        destination: 'MIA-HAV',
        flightDays: ['Martes y Jueves'],
        flightTimes: [
          { ida: '08:00', regreso: '11:30' },
          { ida: '17:00', regreso: '20:30' },
        ],
        periods: [
          {
            label: 'Marzo 1-15',
            rt: 339,
            ow: 259,
          },
          {
            label: 'Marzo 16-31',
            rt: 389,
            ow: 279,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.30/lb',
          'Maletas adicionales: $2.50/lb',
          'Cargo por chequeo: $25 por pieza',
        ],
        additionalInfo: DEFAULT_INFO,
      },
    ],
  },
  {
    name: 'Havana Air',
    destinations: [
      {
        destination: 'MIA-HAV',
        flightDays: ['Miércoles y Sábado'],
        flightTimes: [
          { ida: '09:00', regreso: '12:30' },
          { ida: '18:00', regreso: '21:30' },
        ],
        periods: [
          {
            label: 'Marzo 1-15',
            rt: 359,
            ow: 279,
          },
          {
            label: 'Marzo 16-31',
            rt: 409,
            ow: 299,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.35/lb',
          'Maletas adicionales: $2.60/lb',
          'Cargo por chequeo: $26 por pieza',
        ],
        additionalInfo: DEFAULT_INFO,
      },
    ],
  },
]
