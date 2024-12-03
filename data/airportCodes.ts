// src/data/airportCodes.ts

export const airportNames: { [code: string]: string } = {
  MIA: 'Miami International',
  FLL: 'Fort Lauderdale',
  JAX: 'Jacksonville',
  HAV: 'José Martí International',
  VRA: 'Juan Gualberto Gómez',
  SNU: 'Abel Santamaría',
  CMW: 'Ignacio Agramonte',
  HOG: 'Frank País',
  SCU: 'Antonio Maceo',
  RSW: 'Fort Myers',
  TPA: 'Tampa',
}

export const airportCities: { [code: string]: string } = {
  MIA: 'Miami, FL',
  FLL: 'Fort Lauderdale, FL',
  JAX: 'Jacksonville, FL',
  HAV: 'La Habana, Cuba',
  VRA: 'Varadero, Cuba',
  SNU: 'Santa Clara, Cuba',
  CMW: 'Camagüey, Cuba',
  HOG: 'Holguín, Cuba',
  SCU: 'Santiago de Cuba, Cuba',
  RSW: 'Fort Myers, FL',
  TPA: 'Tampa, FL',
}

export const cubanAirports = ['HAV', 'VRA', 'SNU', 'CMW', 'HOG', 'SCU']
export const floridaAirports = ['MIA', 'FLL', 'JAX', 'RSW', 'TPA']

// All possible routes
export const generateRoutes = () => {
  const routes: string[] = []
  floridaAirports.forEach((from) => {
    cubanAirports.forEach((to) => {
      routes.push(`${from}-${to}`)
    })
  })
  return routes
}

export const defaultRoutes = generateRoutes()
