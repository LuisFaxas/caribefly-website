'use client'

export type SortOption = 'price' | 'departure' | 'availability' | 'charter'
export type SortDirection = 'asc' | 'desc'

interface FlightSortProps {
  onSort: (option: SortOption, direction: SortDirection) => void
  currentSort: {
    option: SortOption
    direction: SortDirection
  }
}

export default function FlightSort({ onSort, currentSort }: FlightSortProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'price', label: 'Price' },
            { value: 'departure', label: 'Departure Time' },
            { value: 'availability', label: 'Availability' },
            { value: 'charter', label: 'Charter' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() =>
                onSort(
                  value as SortOption,
                  currentSort.option === value &&
                    currentSort.direction === 'asc'
                    ? 'desc'
                    : 'asc'
                )
              }
              className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1
                ${
                  currentSort.option === value
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
            >
              <span>{label}</span>
              {currentSort.option === value && (
                <svg
                  className={`w-4 h-4 transform ${
                    currentSort.direction === 'desc' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
