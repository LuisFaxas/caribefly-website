// src/data/airportCodes.ts

export const airportNames: { [code: string]: string } = {
  MIA: 'Miami',
  HAV: 'La Habana',
  CMW: 'Camagüey',
  HOG: 'Holguín',
  SNU: 'Santa Clara',
  SCU: 'Santiago de Cuba',
  RSW: 'Fort Myers',
  TPA: 'Tampa',
}

export const airportCities: { [code: string]: string } = {
  MIA: 'Miami, FL',
  HAV: 'La Habana, Cuba',
  CMW: 'Camagüey, Cuba',
  HOG: 'Holguín, Cuba',
  SNU: 'Santa Clara, Cuba',
  SCU: 'Santiago de Cuba, Cuba',
  RSW: 'Fort Myers, FL',
  TPA: 'Tampa, FL',
}

export const cubanAirports = ['HAV', 'CMW', 'HOG', 'SNU', 'SCU']
export const floridaAirports = ['MIA', 'RSW', 'TPA']
