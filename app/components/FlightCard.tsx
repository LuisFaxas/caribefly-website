'use client'

import { Charter, FlightAvailability } from '@/types/flight'
import { format } from 'date-fns'

interface FlightCardProps {
  charter: Charter
  availability: FlightAvailability
  onSelect: (charter: Charter, availability: FlightAvailability) => void
}

export default function FlightCard({
  charter,
  availability,
  onSelect,
}: FlightCardProps) {
  const formatTime = (time: string) =>
    format(new Date(`2000-01-01T${time}`), 'h:mm a')

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Charter Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{charter.title}</h3>
            <p className="text-sm text-gray-600">
              Flight {availability.schedule.flightNumber}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              ${availability.pricing.regular.total}
            </p>
            <p className="text-xs text-gray-500">includes taxes and fees</p>
          </div>
        </div>
      </div>

      {/* Flight Details */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">
              {formatTime(availability.schedule.departure)}
            </p>
            <p className="text-sm text-gray-600">
              {charter.routes[0].from.code}
            </p>
          </div>
          <div className="flex-1 px-4">
            <div className="relative">
              <div className="border-t-2 border-gray-300 w-full absolute top-1/2"></div>
              <div className="text-xs text-center text-gray-500 relative -top-2">
                Direct Flight
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {formatTime(availability.schedule.arrival)}
            </p>
            <p className="text-sm text-gray-600">{charter.routes[0].to.code}</p>
          </div>
        </div>

        {/* Status and Seats */}
        <div className="flex justify-between items-center mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              availability.status === 'AVAILABLE'
                ? 'bg-green-100 text-green-800'
                : availability.status === 'LIMITED'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}
          >
            {availability.status}
          </span>
          <p className="text-sm text-gray-600">
            {availability.seatsAvailable} seats left at this price
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onSelect(charter, availability)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 
                     transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={availability.status === 'SOLD_OUT'}
          >
            Select Flight
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            onClick={() => {
              /* Add fare details modal */
            }}
          >
            Fare Details
          </button>
        </div>
      </div>
    </div>
  )
}
