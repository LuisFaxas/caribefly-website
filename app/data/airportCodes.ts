export const airportCodes = {
  'MIA-HAV': {
    departure: 'MIA',
    arrival: 'HAV',
    departureName: 'Miami',
    arrivalName: 'La Habana',
  },
  'FLL-HAV': {
    departure: 'FLL',
    arrival: 'HAV',
    departureName: 'Fort Lauderdale',
    arrivalName: 'La Habana',
  },
  'TPA-HAV': {
    departure: 'TPA',
    arrival: 'HAV',
    departureName: 'Tampa',
    arrivalName: 'La Habana',
  },
}

export const airportNames = {
  MIA: 'Miami',
  FLL: 'Fort Lauderdale',
  TPA: 'Tampa',
  HAV: 'La Habana',
}

export type AirportCodeKey = keyof typeof airportCodes
