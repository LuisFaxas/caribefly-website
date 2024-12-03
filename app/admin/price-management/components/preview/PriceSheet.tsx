import React from 'react'
import { format } from 'date-fns'
import type { CharterData, GlobalProfit, Period, DestinationData } from '@/types/charter'
import { airportNames } from '@/data/airportCodes'
import { FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa'
import { Card } from '@/app/components/ui/card'

interface PriceSheetProps {
  charters: CharterData[]
  globalProfit: GlobalProfit
  agencyLogo?: string
  promotionalImage?: string
  selectedDestination: string
}

const PriceSheet: React.FC<PriceSheetProps> = ({
  charters,
  globalProfit,
  agencyLogo,
  promotionalImage,
  selectedDestination,
}) => {
  // Find the first charter that has the selected destination
  const charter = charters.find(c => 
    c.destinations.some(d => d.destination === selectedDestination)
  )
  
  const destination = charter?.destinations.find(
    (d) => d.destination === selectedDestination
  )

  if (!charter || !destination) {
    return (
      <div className="text-center text-gray-400">
        No data available for the selected destination
      </div>
    )
  }

  // Calculate final price with profit
  const calculateFinalPrice = (basePrice: number, type: 'rt' | 'ow') => {
    const profit = globalProfit[type]
    return basePrice + profit
  }

  return (
    <Card className="bg-white text-black p-8">
      {/* Header with logo */}
      <div className="flex justify-between items-center mb-8">
        {agencyLogo && (
          <img
            src={agencyLogo}
            alt="Agency Logo"
            className="h-16 object-contain"
          />
        )}
        <h1 className="text-2xl font-bold">{charter.name}</h1>
      </div>

      {/* Destination Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {destination.destination}
        </h2>

        {/* Flight Times */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Flight Times</h3>
          <div className="grid grid-cols-2 gap-4">
            {destination.flightTimes.map((time, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Departure: {time.ida}</p>
                <p className="text-sm text-gray-600">Return: {time.regreso}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Periods */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Pricing</h3>
          <div className="space-y-4">
            {destination.periods.map((period, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">{period.label}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Round Trip</p>
                    <p className="text-lg font-bold">
                      ${calculateFinalPrice(period.rt, 'rt')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">One Way</p>
                    <p className="text-lg font-bold">
                      ${calculateFinalPrice(period.ow, 'ow')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-2 gap-8">
          {/* Baggage Information */}
          <div>
            <h3 className="text-lg font-medium mb-2">Baggage Information</h3>
            <ul className="list-disc list-inside space-y-2">
              {destination.baggageInfo.map((info, index) => (
                <li key={index} className="text-gray-600">
                  {info}
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-medium mb-2">Additional Information</h3>
            <ul className="list-disc list-inside space-y-2">
              {destination.additionalInfo.map((info, index) => (
                <li key={index} className="text-gray-600">
                  {info}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Promotional Image */}
      {promotionalImage && (
        <div className="mt-8">
          <img
            src={promotionalImage}
            alt="Promotional"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
    </Card>
  )
}

export default PriceSheet
