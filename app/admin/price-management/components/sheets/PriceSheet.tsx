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
    charter?.destinations?.some(
      (dest) => dest.destination === selectedDestination
    )
  )

  // Get the current destination data
  const currentDestination = currentCharter?.destinations?.find(
    (dest) => dest.destination === selectedDestination
  )

  if (!currentCharter || !currentDestination) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          No charter data available for the selected destination.
        </p>
      </div>
    )
  }

  return (
    <div className="w-[800px] bg-gradient-to-b from-gray-800 to-gray-900 p-8 text-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        {/* Logo and Agency Name */}
        <div className="flex items-center gap-4">
          {agencyLogo ? (
            <img
              src={agencyLogo}
              alt="Agency Logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
            />
          ) : (
            <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center border-2 border-yellow-400">
              <span className="text-2xl">✈️</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-yellow-400">CaribeFly</h1>
            <p className="text-gray-300 text-sm">{currentDate}</p>
          </div>
        </div>

        {/* Route Info */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-yellow-400">
            {currentCharter.name}
          </h2>
          <p className="text-gray-300">
            {getFullRouteName(currentDestination.destination)}
          </p>
        </div>

        {/* Contact Info */}
        <div className="text-right">
          <div className="text-yellow-400 text-xs mb-2">
            Consultas y Reservas:
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-end gap-2">
              <FaPhone className="text-yellow-400" />
              <span>(305) 333-7457</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <FaWhatsapp className="text-yellow-400" />
              <span>(305) 333-7458</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <FaEnvelope className="text-yellow-400" />
              <span>ventas@caribefly.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Image */}
      {promotionalImage && (
        <div className="mb-6">
          <img
            src={promotionalImage}
            alt="Promotional"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Flight Information */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-4 bg-gray-800/50 border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">
            Días de Vuelo
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {currentDestination.flightDays.map((day, index) => (
              <li key={index}>{day}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-4 bg-gray-800/50 border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">
            Horarios
          </h3>
          <div className="space-y-2">
            {currentDestination.flightTimes.map((time, index) => (
              <div key={index} className="flex justify-between text-gray-300">
                <span>Ida: {time.ida}</span>
                <span>Regreso: {time.regreso}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pricing Table */}
      <Card className="mb-6 overflow-hidden bg-gray-800/50 border-gray-700">
        <div className="divide-y divide-gray-700">
          <div className="grid grid-cols-3 bg-gray-900 text-yellow-400 font-semibold p-3">
            <div>Período</div>
            <div className="text-center">Ida y Vuelta</div>
            <div className="text-center">Solo Ida</div>
          </div>
          {currentDestination.periods.map((period, index) => (
            <div key={index} className="grid grid-cols-3 p-3">
              <div className="text-gray-300">{period.label}</div>
              <div className="text-center text-gray-300">
                ${calculateFinalPrice(period.rt, 'rt')}
              </div>
              <div className="text-center text-gray-300">
                ${calculateFinalPrice(period.ow, 'ow')}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Additional Information */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-4 bg-gray-800/50 border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">
            Equipaje
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {currentDestination.baggageInfo.map((info, index) => (
              <li key={index}>{info}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-4 bg-gray-800/50 border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">
            Información Adicional
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {currentDestination.additionalInfo.map((info, index) => (
              <li key={index}>{info}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default PriceSheet
