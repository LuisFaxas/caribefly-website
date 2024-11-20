'use client'

import React from 'react'
import { PriceChartWidget } from '@/types/dashboard'

export const PriceChart: React.FC<PriceChartWidget> = ({ content }) => {
  const { prices } = content

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Price History</h3>
      <div className="space-y-2">
        {prices.map((price, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{price.charter}</span>
              <span className="text-xs text-gray-500">{price.route}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold">${price.price}</span>
              <span className="text-xs text-gray-500">
                {new Date(price.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
