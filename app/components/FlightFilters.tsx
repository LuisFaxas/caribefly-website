'use client'

interface FilterOptions {
  charter?: string
  maxPrice?: number
  departureTime?: 'morning' | 'afternoon' | 'evening'
  availabilityStatus?: 'AVAILABLE' | 'LIMITED' | 'SOLD_OUT'
}

interface FlightFiltersProps {
  onFilterChange: (filters: FilterOptions) => void
  availableCharters: string[]
  minPrice: number
  maxPrice: number
}

export default function FlightFilters({
  onFilterChange,
  availableCharters,
  minPrice,
  maxPrice,
}: FlightFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">Filters</h3>

      {/* Charter Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Charter
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          onChange={(e) => onFilterChange({ charter: e.target.value })}
        >
          <option value="">All Charters</option>
          {availableCharters.map((charter) => (
            <option key={charter} value={charter}>
              {charter}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Max Price
        </label>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step="10"
          className="w-full"
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
        />
      </div>

      {/* Departure Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Departure Time
        </label>
        <div className="space-y-2">
          {['morning', 'afternoon', 'evening'].map((time) => (
            <label key={time} className="flex items-center">
              <input
                type="radio"
                name="departureTime"
                value={time}
                onChange={(e) =>
                  onFilterChange({
                    departureTime: e.target.value as
                      | 'morning'
                      | 'afternoon'
                      | 'evening',
                  })
                }
                className="form-radio"
              />
              <span className="ml-2 capitalize">{time}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Availability
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          onChange={(e) =>
            onFilterChange({
              availabilityStatus: e.target.value as
                | 'AVAILABLE'
                | 'LIMITED'
                | 'SOLD_OUT',
            })
          }
        >
          <option value="">All</option>
          <option value="AVAILABLE">Available</option>
          <option value="LIMITED">Limited</option>
        </select>
      </div>
    </div>
  )
}
