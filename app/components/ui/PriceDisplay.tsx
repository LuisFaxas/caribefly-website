import React from 'react'

interface PriceDisplayProps {
  period: {
    label: string
    rt?: number
    ow?: number
    profitOverride?: {
      rt?: number
      ow?: number
    }
  }
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ period }) => {
  const formatPrice = (price?: number) => {
    if (!price) return 'N/A'
    return `$${price.toFixed(2)}`
  }

  return (
    <div className="bg-gray-700/90 p-2 rounded-lg">
      <div className="text-yellow-400 font-medium mb-1">{period.label}</div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-400">R/T:</span>{' '}
          <span className="text-white font-bold">{formatPrice(period.rt)}</span>
        </div>
        <div>
          <span className="text-gray-400">O/W:</span>{' '}
          <span className="text-white font-bold">{formatPrice(period.ow)}</span>
        </div>
      </div>
    </div>
  )
}

export default PriceDisplay
