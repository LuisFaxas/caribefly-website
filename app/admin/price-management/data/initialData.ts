import { CharterData } from '@/types/charter'

export const initialCharterData: CharterData = {
  id: 'default',
  globalProfit: 20,
  destinations: [
    {
      destination: 'MIA-HAV',
      basePrice: 1000,
      roundTripMultiplier: 1.8,
      baggageInfo: [
        'First bag: $50',
        'Second bag: $70',
        'Additional bags: $100'
      ],
      notes: 'Standard charter flight'
    },
    {
      destination: 'FLL-HAV',
      basePrice: 950,
      roundTripMultiplier: 1.8,
      baggageInfo: [
        'First bag: $50',
        'Second bag: $70',
        'Additional bags: $100'
      ],
      notes: 'Standard charter flight'
    }
  ]
