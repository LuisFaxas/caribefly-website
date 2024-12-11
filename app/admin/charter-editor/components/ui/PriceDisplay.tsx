// src/components/ui/PriceDisplay.tsx

import React from 'react'
import type { PeriodData, GlobalProfit } from '@/types'

interface PriceDisplayProps {
  period: PeriodData
  globalProfit: GlobalProfit
  showBase?: boolean
  className?: string
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  period,
  globalProfit,
  showBase = false,
  className = '',
}) => {
  const calculateFinalPrice = (
    base: number | undefined,
    type: keyof GlobalProfit
  ) => {
    if (base === undefined) return null
    const profit = period.profitOverride?.[type] ?? globalProfit[type]
    return base + profit
  }

  const formatPrice = (price: number | null) => {
    if (price === null) return 'N/A'
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div className={`bg-gray-700/90 p-2 rounded-lg ${className}`}>
      {/* Period Label */}
      <div className="bg-gray-800/50 px-2 py-1 rounded-t text-center mb-2">
        <span className="text-yellow-400 text-sm font-medium">
          {period.label}
        </span>
      </div>

      {/* Round Trip Price */}
      {period.rt !== undefined && (
        <div className="flex justify-between items-center px-2 py-1">
          <span className="text-blue-300 font-medium">R/T:</span>
          <div className="text-right">
            {showBase && (
              <div className="text-xs text-gray-400">
                Base: ${period.rt.toFixed(2)}
              </div>
            )}
            <span className="font-bold text-white">
              ${formatPrice(calculateFinalPrice(period.rt, 'rt'))}
            </span>
          </div>
        </div>
      )}

      {/* One Way Price */}
      {period.ow !== undefined && (
        <div className="flex justify-between items-center px-2 py-1">
          <span className="text-green-300 font-medium">O/W:</span>
          <div className="text-right">
            {showBase && (
              <div className="text-xs text-gray-400">
                Base: ${period.ow.toFixed(2)}
              </div>
            )}
            <span className="font-bold text-white">
              ${formatPrice(calculateFinalPrice(period.ow, 'ow'))}
            </span>
          </div>
        </div>
      )}

      {/* Profit Override Indicators */}
      {(period.profitOverride?.rt !== undefined ||
        period.profitOverride?.ow !== undefined) && (
        <div className="mt-1 pt-1 border-t border-gray-600/50 text-xs text-gray-400">
          {period.profitOverride.rt !== undefined && (
            <div className="flex justify-between">
              <span>Ganancia R/T:</span>
              <span>+${period.profitOverride.rt}</span>
            </div>
          )}
          {period.profitOverride.ow !== undefined && (
            <div className="flex justify-between">
              <span>Ganancia O/W:</span>
              <span>+${period.profitOverride.ow}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PriceDisplay
