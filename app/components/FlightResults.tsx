//app/components/FlightResults.tsx
'use client'

import { Charter, FlightAvailability } from '@/types/flight'

interface FlightResultsProps {
  results: Array<{
    charter: Charter
    availability: FlightAvailability
  }>
  onSelect: (charter: Charter, availability: FlightAvailability) => void
}

export default function FlightResults({
  results,
  onSelect,
}: FlightResultsProps) {
  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div
          key={`${result.charter.id}-${index}`}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{result.charter.title}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  result.availability.status === 'AVAILABLE'
                    ? 'bg-green-100 text-green-800'
                    : result.availability.status === 'LIMITED'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {result.availability.status}
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Available Seats</p>
                <p className="text-lg font-semibold">
                  {result.availability.seatsAvailable} /{' '}
                  {result.availability.seatsTotal}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Regular Price</p>
                <p className="text-lg font-semibold">
                  $
                  {result.charter.pricing?.[result.availability.date]?.regular
                    .total || 'N/A'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelect(result.charter, result.availability)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={result.availability.status === 'SOLD_OUT'}
            >
              Select Flight
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
