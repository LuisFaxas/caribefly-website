import React from 'react'
import type { DestinationData } from '@/types/charter'

interface PriceDisplayProps {
  destinationData: DestinationData
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ destinationData }) => {
  const formatPrice = (price?: number) => {
    if (!price && price !== 0) return 'N/A'
    return `$${price.toFixed(2)}`
  }

  if (!destinationData?.periods?.length) {
    return (
      <div className="bg-gray-700/90 p-2 rounded-lg">
        <div className="text-gray-400 text-center">
          No hay información de precios
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {destinationData.periods.map((period, idx) => (
        <div key={`${period.label}-${idx}`} className="bg-gray-700/90 p-2 rounded-lg">
          <div className="text-yellow-400 font-medium mb-1">{period.label}</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">R/T:</span>{' '}
              <span className="text-white font-bold">
                {formatPrice(period.rt)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">O/W:</span>{' '}
              <span className="text-white font-bold">
                {formatPrice(period.ow)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PriceDisplay
