'use client'

import type { FlightTab } from '@/types/dashboard'
import type { Charter, Promotion, Announcement } from '@/types/flight'
import { Card } from '../../../admin/components/ui/card'

interface FlightTabContentProps {
  tab: FlightTab
  data: any // Replace with proper type once data structure is finalized
}

export default function FlightTabContent({ tab, data }: FlightTabContentProps) {
  return (
    <div className="flight-tab-content">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{tab.title}</h3>
        <p className="text-gray-600">{tab.description}</p>
      </div>

      {/* Flight Information */}
      <div className="grid gap-4">
        {data?.flights?.map((flight: any, index: number) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-medium">{flight.airline}</span>
                <span className="text-gray-500 mx-2">•</span>
                <span className="text-sm text-gray-600">
                  Flight {flight.flightNumber}
                </span>
              </div>
              <div className="text-lg font-semibold text-blue-600">
                ${flight.price}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Departure</div>
                <div className="font-medium">{flight.departureTime}</div>
                <div className="text-gray-600">{flight.origin}</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-gray-400">
                  {flight.duration}
                  <div className="border-t border-gray-300 my-1"></div>
                  <div className="text-xs text-center">Direct</div>
                </div>
              </div>
              <div>
                <div className="text-gray-500">Arrival</div>
                <div className="font-medium">{flight.arrivalTime}</div>
                <div className="text-gray-600">{flight.destination}</div>
              </div>
            </div>

            {/* Additional Flight Info */}
            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Baggage Allowance</div>
                <div>{flight.baggage}</div>
              </div>
              <div>
                <div className="text-gray-500">Aircraft</div>
                <div>{flight.aircraft}</div>
              </div>
            </div>

            {/* Book Button */}
            <div className="mt-4">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Select Flight
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
