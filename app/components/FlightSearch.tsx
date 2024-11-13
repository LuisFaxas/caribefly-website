//app/components/FlightSearch.tsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import type { SearchParams } from '@/types/flight'

interface FlightSearchProps {
  onSearch: (params: SearchParams) => void
  loading?: boolean
}

export default function FlightSearch({
  onSearch,
  loading = false,
}: FlightSearchProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: 'MIA',
    destination: '',
    departureDate: new Date(),
    returnDate: undefined,
    passengers: 1,
    tripType: 'roundtrip',
  })

  const [showCalendar, setShowCalendar] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchParams)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
    >
      {/* Trip Type Selection */}
      <div className="md:col-span-3 flex gap-4 justify-center">
        <label className="inline-flex items-center">
          <input
            type="radio"
            checked={searchParams.tripType === 'roundtrip'}
            onChange={() =>
              setSearchParams((prev) => ({ ...prev, tripType: 'roundtrip' }))
            }
            className="form-radio text-blue-600"
          />
          <span className="ml-2">Round Trip</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            checked={searchParams.tripType === 'oneway'}
            onChange={() =>
              setSearchParams((prev) => ({ ...prev, tripType: 'oneway' }))
            }
            className="form-radio text-blue-600"
          />
          <span className="ml-2">One Way</span>
        </label>
      </div>

      {/* Origin & Destination */}
      <select
        value={searchParams.destination}
        onChange={(e) =>
          setSearchParams((prev) => ({ ...prev, destination: e.target.value }))
        }
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      >
        <option value="">Select Destination</option>
        <option value="HAV">Havana (HAV)</option>
        <option value="VRA">Varadero (VRA)</option>
        <option value="SNU">Santa Clara (SNU)</option>
        <option value="HOG">Holguin (HOG)</option>
        <option value="CMW">Camaguey (CMW)</option>
      </select>

      {/* Date Selection */}
      <div className="relative">
        <input
          type="date"
          value={format(searchParams.departureDate, 'yyyy-MM-dd')}
          onChange={(e) =>
            setSearchParams((prev) => ({
              ...prev,
              departureDate: new Date(e.target.value),
            }))
          }
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          required
        />
      </div>

      {/* Passengers */}
      <input
        type="number"
        min="1"
        max="9"
        value={searchParams.passengers}
        onChange={(e) =>
          setSearchParams((prev) => ({
            ...prev,
            passengers: parseInt(e.target.value),
          }))
        }
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      {/* Search Button */}
      <button
        type="submit"
        disabled={loading}
        className="md:col-span-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Searching...' : 'Search Flights'}
      </button>
    </form>
  )
}
