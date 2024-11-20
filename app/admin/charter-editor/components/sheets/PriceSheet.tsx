// src/components/sheets/PriceSheet.tsx

'use client'

import React from 'react'
import type {
  CharterData,
  GlobalProfit,
  DestinationData,
} from '@/types/charter'
import { airportNames } from '@/data/airportCodes'
import { cn } from '@/lib/utils'

interface PriceSheetProps {
  charter: CharterData
  destination: DestinationData
  globalProfit: GlobalProfit
  agencyLogo?: string
  promotionalImage?: string
}

const PriceSheet = ({
  charter,
  destination,
  globalProfit,
  agencyLogo,
  promotionalImage,
}: PriceSheetProps) => {
  const currentDate = new Date().toLocaleDateString('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const getFullRouteName = (routeCode: string) => {
    const [fromCode, toCode] = routeCode.split('-')
    const fromName = airportNames[fromCode] || fromCode
    const toName = airportNames[toCode] || toCode
    return `${fromName} (${fromCode}) - ${toName} (${toCode})`
  }

  const calculatePrice = (basePrice: number, profitOverride?: number) => {
    const profit = profitOverride ?? globalProfit.rt
    return basePrice + profit
  }

  return (
    <div className="w-[800px] bg-gradient-to-b from-gray-800 to-gray-900 p-8 text-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          {agencyLogo && (
            <img
              src={agencyLogo}
              alt="Agency Logo"
              className="h-16 w-auto object-contain"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">Charter Prices</h1>
            <p className="text-gray-300">{currentDate}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">{charter.name}</h2>
          <p className="text-gray-300">
            {getFullRouteName(destination.destination)}
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
              {destination.flightDays.map((day) => (
                <li key={day}>{day}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Flight Times</h4>
            <ul className="list-disc list-inside text-gray-300">
              {destination.flightTimes.map((time, index) => (
                <li key={index}>
                  Departure: {time.ida} - Return: {time.regreso}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Pricing</h3>
        <div className="overflow-hidden rounded-lg border border-gray-700">
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
              {destination.periods.map((period, index) => (
                <tr
                  key={index}
                  className={cn(
                    'transition-colors',
                    index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'
                  )}
                >
                  <td className="px-6 py-4 text-sm">{period.label}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    ${calculatePrice(period.rt || 0, period.profitOverride?.rt)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    ${calculatePrice(period.ow || 0, period.profitOverride?.ow)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-6">
        {destination.baggageInfo.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Baggage Information</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {destination.baggageInfo.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          </div>
        )}

        {destination.additionalInfo.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Additional Information
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {destination.additionalInfo.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default PriceSheet
