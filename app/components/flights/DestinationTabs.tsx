'use client'

import { useState } from 'react'
import { DESTINATIONS } from '@/constants/defaults'
import PriceDisplay from './PriceDisplay'

export default function DestinationTabs() {
  const [activeDestination, setActiveDestination] = useState(
    DESTINATIONS[0].code
  )

  return (
    <div className="destination-tabs">
      {/* Tabs Navigation */}
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {DESTINATIONS.map((dest) => (
              <button
                key={dest.code}
                onClick={() => setActiveDestination(dest.code)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${
                    activeDestination === dest.code
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {dest.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PriceDisplay destinationCode={activeDestination} />
      </div>
    </div>
  )
}
