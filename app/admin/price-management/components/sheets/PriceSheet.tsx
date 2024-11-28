// src/components/sheets/PriceSheet.tsx

import React from 'react'
import { CharterData, GlobalProfit } from '@/types/charter'
import { FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import { airportNames } from '@/data/airportCodes'
import { Card } from '@/app/components/ui/card'

interface PriceSheetProps {
  charters: CharterData[]
  selectedDestination: string
  globalProfit: GlobalProfit
  agencyLogo?: string
  promotionalImage?: string
}

const PriceSheet: React.FC<PriceSheetProps> = ({
  charters,
  selectedDestination,
  globalProfit,
  agencyLogo,
  promotionalImage,
}) => {
  // Format the current date in Spanish
  const currentDate = new Date().toLocaleDateString('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Get the full route name from codes
  const getFullRouteName = (routeCode: string) => {
    try {
      const [fromCode, toCode] = routeCode.split('-')
      const fromName = airportNames[fromCode] || fromCode
      const toName = airportNames[toCode] || toCode
      return `${fromName} (${fromCode}) - ${toName} (${toCode})`
    } catch (error) {
      console.error('Error parsing route code:', error)
      return routeCode
    }
  }

  // Calculate final price with profit
  const calculateFinalPrice = (basePrice: number, type: 'rt' | 'ow') => {
    const profit = globalProfit[type]
    return basePrice + profit
  }

  // Get the current charter data
  const currentCharter = charters?.find((charter) =>
    charter?.destinations?.some((dest) => dest.destination === selectedDestination)
  )

  // Get the current destination data
  const currentDestination = currentCharter?.destinations?.find(
    (dest) => dest.destination === selectedDestination
  )

  if (!currentCharter || !currentDestination) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No charter data available for the selected destination.</p>
      </div>
    )
  }

  return (
    <div className="price-sheet">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          {agencyLogo ? (
            <img
              src={agencyLogo}
              alt="Agency Logo"
              className="h-16 w-auto object-contain"
            />
          ) : (
            <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center">
              <span className="text-2xl">✈️</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">Charter Prices</h1>
            <p className="text-gray-300">{currentDate}</p>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-xl font-semibold">{currentCharter.name}</h2>
          <p className="text-gray-300">
            {getFullRouteName(currentDestination.destination)}
          </p>
        </div>
      </div>

      {/* Promotional Image */}
      {promotionalImage && (
        <div className="mb-8">
          <img
            src={promotionalImage}
            alt="Promotional"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Flight Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Flight Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Flight Days</h4>
            <ul className="list-disc list-inside text-gray-300">
              {currentDestination.flightDays.map((day, index) => (
                <li key={index}>{day}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Flight Times</h4>
            <ul className="list-disc list-inside text-gray-300">
              {currentDestination.flightTimes.map((time, index) => (
                <li key={index}>
                  Departure: {time.ida} - Return: {time.regreso}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Price Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Pricing</h3>
        <Card className="overflow-hidden border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Period
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold">
                  Round Trip
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold">
                  One Way
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentDestination.periods.map((period, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'
                  }`}
                >
                  <td className="px-6 py-4 text-sm">{period.label}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    ${calculateFinalPrice(period.rt, 'rt').toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    ${calculateFinalPrice(period.ow, 'ow').toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Additional Information */}
      <div className="space-y-6">
        {currentDestination.baggageInfo?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Baggage Information</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {currentDestination.baggageInfo.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          </div>
        )}

        {currentDestination.additionalInfo?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Additional Information
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {currentDestination.additionalInfo.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="mt-8 text-right space-y-2">
        <div className="text-yellow-400 text-xs mb-1">
          For Inquiries and Reservations:
        </div>
        <div className="flex items-center justify-end gap-2 text-lg font-bold">
          <FaPhone className="text-base" />
          <span>(305) 333-7457</span>
        </div>
        <div className="flex items-center justify-end gap-2 text-lg font-bold">
          <FaWhatsapp className="text-base" />
          <span>(305) 333-7458</span>
        </div>
        <div className="flex items-center justify-end gap-2 text-lg font-bold">
          <FaEnvelope className="text-base" />
          <span>ventas@caribefly.com</span>
        </div>
      </div>
    </div>
  )
}

export default PriceSheet
