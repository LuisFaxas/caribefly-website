// src/components/sheets/PriceSheet.tsx

import React, { useMemo } from 'react'
import type { CharterData } from '@/types/charter'
import { airportNames } from '@/app/data/airportCodes'
import { FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa'
import { PriceDisplay } from '@/app/components/ui'

interface PriceSheetProps {
  charters: CharterData[]
  agencyLogo?: string
  promotionalImage?: string
  selectedDestination: string
}

const PriceSheet: React.FC<PriceSheetProps> = ({
  charters = [], // Provide default empty array
  agencyLogo,
  promotionalImage,
  selectedDestination,
}) => {
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

  // Filter charters that have the selected destination
  const filteredCharters = useMemo(() => {
    if (!charters?.length || !selectedDestination) return []
    return charters.filter(
      (charter) =>
        charter?.destinations?.some?.(
          (dest) => dest?.destination === selectedDestination
        ) ?? false
    )
  }, [charters, selectedDestination])

  return (
    <div className="w-[800px] bg-gradient-to-b from-gray-800 to-gray-900 p-4 text-white">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          {agencyLogo ? (
            <img
              src={agencyLogo}
              alt="Logo de la Agencia"
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center border-2 border-yellow-400">
              <span className="text-2xl">✈️</span>
            </div>
          )}
          <h2 className="text-xl font-bold">CaribeFly</h2>
        </div>

        {/* Date and Route Section */}
        <div className="text-center">
          <div className="text-sm text-gray-300">{currentDate}</div>
          <div className="text-xl font-bold text-yellow-400">
            {selectedDestination
              ? getFullRouteName(selectedDestination)
              : getFullRouteName('MIA-HAV')}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-right">
          <div className="text-yellow-400 text-xs mb-1">
            Consultas y Reservas:
          </div>
          <div className="space-y-1">
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
      </div>

      {/* Charters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCharters?.length > 0 ? (
          filteredCharters.map((charter, index) => {
            // Get the destination data for the selected destination
            const destinationData = charter?.destinations?.find?.(
              (dest) => dest?.destination === selectedDestination
            )

            // Skip if the charter doesn't have data for the selected destination
            if (!destinationData) return null

            return (
              <div
                key={`${charter.name}-${index}`}
                className="bg-gray-800/90 rounded-lg shadow-md overflow-hidden"
              >
                {/* Charter Name */}
                <div className="bg-yellow-400 text-black py-1 px-2 text-center font-bold">
                  {charter.name}
                </div>

                <div className="p-4 space-y-4">
                  {/* Flight Schedule */}
                  <div>
                    <div className="bg-[#5C6C87] px-2 py-1 rounded-t text-center">
                      <div className="text-yellow-400 text-xs font-medium">
                        Días y Horarios
                      </div>
                    </div>
                    <div className="bg-gray-700/90 p-2 rounded-b">
                      {destinationData?.flightDays?.map((day, idx) => (
                        <div
                          key={`${day}-${idx}`}
                          className="flex justify-between items-center py-1"
                        >
                          <span className="text-blue-300 font-medium">
                            {day || 'N/A'}
                          </span>
                          <span className="text-gray-300">
                            {destinationData?.flightTimes?.[idx] ? (
                              <>
                                Ida: {destinationData.flightTimes[idx].ida} /
                                Regreso:{' '}
                                {destinationData.flightTimes[idx].regreso}
                              </>
                            ) : (
                              'N/A'
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Baggage Info */}
                  <div>
                    <div className="bg-[#5C6C87] px-2 py-1 rounded-t text-center">
                      <div className="text-yellow-400 text-xs font-medium">
                        Equipaje
                      </div>
                    </div>
                    <div className="bg-gray-700/90 p-2 rounded-b">
                      {destinationData?.baggageInfo?.map((info, idx) => (
                        <div key={`${info}-${idx}`} className="py-1">
                          {info}
                        </div>
                      )) || (
                        <div className="py-1">
                          No hay información de equipaje
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <div className="bg-[#5C6C87] px-2 py-1 rounded-t text-center">
                      <div className="text-yellow-400 text-xs font-medium">
                        Información Adicional
                      </div>
                    </div>
                    <div className="bg-gray-700/90 p-2 rounded-b">
                      {destinationData?.additionalInfo?.map((info, idx) => (
                        <div key={`${info}-${idx}`} className="py-1">
                          {info}
                        </div>
                      )) || (
                        <div className="py-1">No hay información adicional</div>
                      )}
                    </div>
                  </div>

                  {/* Price Display */}
                  <PriceDisplay destinationData={destinationData} />
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-2 text-center text-gray-400 py-8">
            No hay charters disponibles para este destino
          </div>
        )}
      </div>
    </div>
  )
}

export default PriceSheet
