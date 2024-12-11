// src/data/charterData.ts

import type { CharterData } from '@/types'

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
        additionalInfo: [
          'Impuestos USA incluidos',
          'Tasa de salida: $27',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
          'Recarga de combustible: $25',
        ],
      },
      {
        destination: 'MIA-SNU',
        flightDays: ['Lunes y Jueves'],
        flightTimes: [
          { ida: '07:00', regreso: '10:30' },
          { ida: '15:00', regreso: '18:30' },
        ],
        periods: [
          {
            label: 'Marzo 1-15',
            rt: 369,
            ow: 289,
          },
          {
            label: 'Marzo 16-31',
            rt: 419,
            ow: 309,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.50/lb',
          'Maletas adicionales: $2.80/lb',
          'Cargo por chequeo: $28 por pieza',
        ],
        additionalInfo: [
          'Impuestos USA incluidos',
          'Tasa de salida: $27',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
          'Recarga de combustible: $25',
        ],
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
            label: 'Noviembre 1-30 (excepto 27-30)',
            rt: 299,
            ow: 229,
          },
          {
            label: 'Noviembre 27-30',
            rt: 359,
            ow: 249,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.00/lb',
          'Maletas adicionales: $2.00/lb',
          'Cargo por chequeo: $25 por pieza',
        ],
        additionalInfo: [
          'Impuestos USA incluidos',
          'Tasa de salida: $27',
          'Cargo por reserva: $9',
          'Recarga de combustible: $25',
        ],
      },
      {
        destination: 'MIA-CMW',
        flightDays: ['Martes y Viernes'],
        flightTimes: [
          { ida: '06:45', regreso: '09:15' },
          { ida: '14:30', regreso: '17:00' },
        ],
        periods: [
          {
            label: 'Noviembre 1-30',
            rt: 319,
            ow: 239,
          },
          {
            label: 'Temporada Alta',
            rt: 379,
            ow: 279,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.10/lb',
          'Maletas adicionales: $2.20/lb',
          'Cargo por chequeo: $25 por pieza',
        ],
        additionalInfo: [
          'Impuestos USA incluidos',
          'Tasa de salida: $27',
          'Cargo por reserva: $9',
          'Recarga de combustible: $25',
        ],
      },
      {
        destination: 'MIA-HOG',
        flightDays: ['Lunes y Sábado'],
        flightTimes: [
          { ida: '07:45', regreso: '10:15' },
          { ida: '15:30', regreso: '18:00' },
        ],
        periods: [
          {
            label: 'Noviembre 1-30',
            rt: 339,
            ow: 249,
          },
          {
            label: 'Temporada Alta',
            rt: 399,
            ow: 289,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.20/lb',
          'Maletas adicionales: $2.30/lb',
          'Cargo por chequeo: $25 por pieza',
        ],
        additionalInfo: [
          'Impuestos USA incluidos',
          'Tasa de salida: $27',
          'Cargo por reserva: $9',
          'Recarga de combustible: $25',
        ],
      },
    ],
  },
  {
    name: 'Cubazul',
    destinations: [
      {
        destination: 'MIA-HAV',
        flightDays: ['Lunes, Miércoles y Viernes'],
        flightTimes: [
          { ida: '10:00', regreso: '13:15' },
          { ida: '15:00', regreso: '18:15' },
        ],
        periods: [
          {
            label: 'Diciembre 1-15',
            rt: 319,
            ow: 239,
          },
          {
            label: 'Diciembre 16-31',
            rt: 379,
            ow: 269,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.20/lb',
          'Maletas adicionales: $2.50/lb',
          'Cargo por chequeo: $30 por pieza',
        ],
        additionalInfo: [
          'Incluye todos los impuestos',
          'No incluye seguro de viaje',
          'Tasa de salida: $27',
          'Tasa sanitaria: $35',
        ],
      },
      {
        destination: 'MIA-SNU',
        flightDays: ['Martes y Jueves'],
        flightTimes: [
          { ida: '09:00', regreso: '12:15' },
          { ida: '14:00', regreso: '17:15' },
        ],
        periods: [
          {
            label: 'Diciembre 1-15',
            rt: 329,
            ow: 249,
          },
          {
            label: 'Diciembre 16-31',
            rt: 389,
            ow: 279,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.20/lb',
          'Maletas adicionales: $2.50/lb',
          'Cargo por chequeo: $30 por pieza',
        ],
        additionalInfo: [
          'Incluye todos los impuestos',
          'No incluye seguro de viaje',
          'Tasa de salida: $27',
          'Tasa sanitaria: $35',
        ],
      },
      {
        destination: 'MIA-CMW',
        flightDays: ['Miércoles y Sábado'],
        flightTimes: [
          { ida: '08:00', regreso: '11:15' },
          { ida: '16:00', regreso: '19:15' },
        ],
        periods: [
          {
            label: 'Diciembre 1-15',
            rt: 339,
            ow: 259,
          },
          {
            label: 'Diciembre 16-31',
            rt: 399,
            ow: 289,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.20/lb',
          'Maletas adicionales: $2.50/lb',
          'Cargo por chequeo: $30 por pieza',
        ],
        additionalInfo: [
          'Incluye todos los impuestos',
          'No incluye seguro de viaje',
          'Tasa de salida: $27',
          'Tasa sanitaria: $35',
        ],
      },
      {
        destination: 'MIA-HOG',
        flightDays: ['Lunes y Viernes'],
        flightTimes: [
          { ida: '11:00', regreso: '14:15' },
          { ida: '17:00', regreso: '20:15' },
        ],
        periods: [
          {
            label: 'Diciembre 1-15',
            rt: 349,
            ow: 269,
          },
          {
            label: 'Diciembre 16-31',
            rt: 409,
            ow: 299,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.20/lb',
          'Maletas adicionales: $2.50/lb',
          'Cargo por chequeo: $30 por pieza',
        ],
        additionalInfo: [
          'Incluye todos los impuestos',
          'No incluye seguro de viaje',
          'Tasa de salida: $27',
          'Tasa sanitaria: $35',
        ],
      },
      {
        destination: 'RSW-HAV',
        flightDays: ['Martes y Domingo'],
        flightTimes: [{ ida: '11:00', regreso: '14:15' }],
        periods: [
          {
            label: 'Diciembre 1-15',
            rt: 359,
            ow: 279,
          },
          {
            label: 'Diciembre 16-31',
            rt: 419,
            ow: 309,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.30/lb',
          'Maletas adicionales: $2.60/lb',
          'Cargo por chequeo: $30 por pieza',
        ],
        additionalInfo: [
          'Incluye todos los impuestos',
          'No incluye seguro de viaje',
          'Tasa de salida: $27',
          'Tasa sanitaria: $35',
        ],
      },
      {
        destination: 'RSW-SNU',
        flightDays: ['Jueves y Sábado'],
        flightTimes: [{ ida: '12:00', regreso: '15:15' }],
        periods: [
          {
            label: 'Diciembre 1-15',
            rt: 369,
            ow: 289,
          },
          {
            label: 'Diciembre 16-31',
            rt: 429,
            ow: 319,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.30/lb',
          'Maletas adicionales: $2.60/lb',
          'Cargo por chequeo: $30 por pieza',
        ],
        additionalInfo: [
          'Incluye todos los impuestos',
          'No incluye seguro de viaje',
          'Tasa de salida: $27',
          'Tasa sanitaria: $35',
        ],
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
          { ida: '09:00', regreso: '11:45' },
          { ida: '14:30', regreso: '17:15' },
        ],
        periods: [
          {
            label: 'Enero 1-15',
            rt: 329,
            ow: 249,
          },
          {
            label: 'Enero 16-31',
            rt: 389,
            ow: 279,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.30/lb',
          'Maletas adicionales: $2.80/lb',
          'Cargo por chequeo: $28 por pieza',
        ],
        additionalInfo: [
          'Incluye impuestos de entrada y salida',
          'Aplica recargo por cambio de fecha',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
        ],
      },
      {
        destination: 'MIA-SNU',
        flightDays: ['Lunes y Viernes'],
        flightTimes: [
          { ida: '10:00', regreso: '12:45' },
          { ida: '15:30', regreso: '18:15' },
        ],
        periods: [
          {
            label: 'Enero 1-15',
            rt: 339,
            ow: 259,
          },
          {
            label: 'Enero 16-31',
            rt: 399,
            ow: 289,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.30/lb',
          'Maletas adicionales: $2.80/lb',
          'Cargo por chequeo: $28 por pieza',
        ],
        additionalInfo: [
          'Incluye impuestos de entrada y salida',
          'Aplica recargo por cambio de fecha',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
        ],
      },
      {
        destination: 'MIA-CMW',
        flightDays: ['Miércoles y Sábado'],
        flightTimes: [
          { ida: '11:00', regreso: '13:45' },
          { ida: '16:30', regreso: '19:15' },
        ],
        periods: [
          {
            label: 'Enero 1-15',
            rt: 349,
            ow: 269,
          },
          {
            label: 'Enero 16-31',
            rt: 409,
            ow: 299,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.30/lb',
          'Maletas adicionales: $2.80/lb',
          'Cargo por chequeo: $28 por pieza',
        ],
        additionalInfo: [
          'Incluye impuestos de entrada y salida',
          'Aplica recargo por cambio de fecha',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
        ],
      },
      {
        destination: 'MIA-HOG',
        flightDays: ['Domingo'],
        flightTimes: [
          { ida: '08:00', regreso: '10:45' },
          { ida: '13:30', regreso: '16:15' },
        ],
        periods: [
          {
            label: 'Enero 1-15',
            rt: 359,
            ow: 279,
          },
          {
            label: 'Enero 16-31',
            rt: 419,
            ow: 309,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.30/lb',
          'Maletas adicionales: $2.80/lb',
          'Cargo por chequeo: $28 por pieza',
        ],
        additionalInfo: [
          'Incluye impuestos de entrada y salida',
          'Aplica recargo por cambio de fecha',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
        ],
      },
      {
        destination: 'TPA-HAV',
        flightDays: ['Martes y Sábado'],
        flightTimes: [{ ida: '09:30', regreso: '12:15' }],
        periods: [
          {
            label: 'Enero 1-15',
            rt: 369,
            ow: 289,
          },
          {
            label: 'Enero 16-31',
            rt: 429,
            ow: 319,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.40/lb',
          'Maletas adicionales: $2.90/lb',
          'Cargo por chequeo: $28 por pieza',
        ],
        additionalInfo: [
          'Incluye impuestos de entrada y salida',
          'Aplica recargo por cambio de fecha',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
        ],
      },
      {
        destination: 'TPA-SNU',
        flightDays: ['Jueves'],
        flightTimes: [{ ida: '10:30', regreso: '13:15' }],
        periods: [
          {
            label: 'Enero 1-15',
            rt: 379,
            ow: 299,
          },
          {
            label: 'Enero 16-31',
            rt: 439,
            ow: 329,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.40/lb',
          'Maletas adicionales: $2.90/lb',
          'Cargo por chequeo: $28 por pieza',
        ],
        additionalInfo: [
          'Incluye impuestos de entrada y salida',
          'Aplica recargo por cambio de fecha',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
        ],
      },
    ],
  },
  {
    name: 'Havana Air',
    destinations: [
      {
        destination: 'MIA-HAV',
        flightDays: ['Lunes, Miércoles, Viernes y Domingo'],
        flightTimes: [
          { ida: '08:30', regreso: '11:00' },
          { ida: '16:00', regreso: '18:30' },
        ],
        periods: [
          {
            label: 'Febrero 1-14',
            rt: 309,
            ow: 239,
          },
          {
            label: 'Febrero 15-28',
            rt: 359,
            ow: 269,
          },
          {
            label: 'Temporada Alta',
            rt: 399,
            ow: 299,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.50/lb',
          'Maletas adicionales: $3.00/lb',
          'Cargo por chequeo: $27 por pieza',
        ],
        additionalInfo: [
          'Impuestos de salida y entrada incluidos',
          'Seguro opcional disponible',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
        ],
      },
      {
        destination: 'MIA-SNU',
        flightDays: ['Martes y Sábado'],
        flightTimes: [
          { ida: '09:30', regreso: '12:00' },
          { ida: '17:00', regreso: '19:30' },
        ],
        periods: [
          {
            label: 'Febrero 1-14',
            rt: 329,
            ow: 259,
          },
          {
            label: 'Febrero 15-28',
            rt: 379,
            ow: 289,
          },
          {
            label: 'Temporada Alta',
            rt: 419,
            ow: 319,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.50/lb',
          'Maletas adicionales: $3.00/lb',
          'Cargo por chequeo: $27 por pieza',
        ],
        additionalInfo: [
          'Impuestos de salida y entrada incluidos',
          'Seguro opcional disponible',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
        ],
      },
      {
        destination: 'MIA-HOG',
        flightDays: ['Jueves y Domingo'],
        flightTimes: [
          { ida: '10:30', regreso: '13:00' },
          { ida: '18:00', regreso: '20:30' },
        ],
        periods: [
          {
            label: 'Febrero 1-14',
            rt: 349,
            ow: 269,
          },
          {
            label: 'Febrero 15-28',
            rt: 399,
            ow: 299,
          },
          {
            label: 'Temporada Alta',
            rt: 439,
            ow: 329,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.50/lb',
          'Maletas adicionales: $3.00/lb',
          'Cargo por chequeo: $27 por pieza',
        ],
        additionalInfo: [
          'Impuestos de salida y entrada incluidos',
          'Seguro opcional disponible',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
        ],
      },
      {
        destination: 'TPA-HAV',
        flightDays: ['Lunes y Viernes'],
        flightTimes: [
          { ida: '11:30', regreso: '14:00' },
          { ida: '19:00', regreso: '21:30' },
        ],
        periods: [
          {
            label: 'Febrero 1-14',
            rt: 339,
            ow: 259,
          },
          {
            label: 'Febrero 15-28',
            rt: 389,
            ow: 289,
          },
          {
            label: 'Temporada Alta',
            rt: 429,
            ow: 319,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.60/lb',
          'Maletas adicionales: $3.10/lb',
          'Cargo por chequeo: $27 por pieza',
        ],
        additionalInfo: [
          'Impuestos de salida y entrada incluidos',
          'Seguro opcional disponible',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
        ],
      },
      {
        destination: 'TPA-HOG',
        flightDays: ['Miércoles'],
        flightTimes: [{ ida: '12:30', regreso: '15:00' }],
        periods: [
          {
            label: 'Febrero 1-14',
            rt: 369,
            ow: 279,
          },
          {
            label: 'Febrero 15-28',
            rt: 419,
            ow: 309,
          },
          {
            label: 'Temporada Alta',
            rt: 459,
            ow: 339,
          },
        ],
        baggageInfo: [
          'Primeras dos maletas: $1.60/lb',
          'Maletas adicionales: $3.10/lb',
          'Cargo por chequeo: $27 por pieza',
        ],
        additionalInfo: [
          'Impuestos de salida y entrada incluidos',
          'Seguro opcional disponible',
          'Tasa sanitaria: $35',
          'Cargo por reserva: $9',
        ],
      },
    ],
  },
]

export default initialCharterData
