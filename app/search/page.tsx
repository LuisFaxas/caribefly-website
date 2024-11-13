'use client'

import { useState, useEffect } from 'react'
import { format, addMinutes, isBefore } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import FlightCard from '../components/FlightCard'
import FlightFilters from '../components/FlightFilters'
import FlightSort, { SortOption, SortDirection } from '../components/FlightSort'
import type { Charter, FlightAvailability, FilterOptions } from '@/types/flight'
import { XaelService } from '@/lib/services/xael-service'

interface SearchState {
  results: Array<{
    charter: Charter
    availability: FlightAvailability
  }>
  loading: boolean
  error: string | null
  timestamp: Date
  searchParams: {
    origin: string
    destination: string
    date: string
    passengers: number
    tripType: 'oneway' | 'roundtrip'
  }
  filters: FilterOptions
  sort: {
    option: SortOption
    direction: SortDirection
  }
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const [searchState, setSearchState] = useState<SearchState>({
    results: [],
    loading: true,
    error: null,
    timestamp: new Date(),
    searchParams: {
      origin: searchParams.get('origin') || 'MIA',
      destination: searchParams.get('destination') || '',
      date: searchParams.get('date') || '',
      passengers: Number(searchParams.get('passengers')) || 1,
      tripType:
        (searchParams.get('tripType') as 'oneway' | 'roundtrip') || 'roundtrip',
    },
    filters: {},
    sort: {
      option: 'price',
      direction: 'asc',
    },
  })

  // Fetch flight results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const xaelService = new XaelService({
          username: process.env.NEXT_PUBLIC_XAEL_USERNAME!,
          password: process.env.NEXT_PUBLIC_XAEL_PASSWORD!,
        })

        const results = await xaelService.getAvailability(
          searchState.searchParams.origin,
          searchState.searchParams.destination,
          new Date(searchState.searchParams.date)
        )

        setSearchState((prev) => ({
          ...prev,
          results: results.map((availability) => ({
            charter: {
              id: 'xael',
              title: 'XAEL Charters',
              system: 'airmax',
              routes: [
                {
                  from: { code: 'MIA', city: 'Miami' },
                  to: {
                    code: searchState.searchParams.destination,
                    city: 'Destination City',
                  },
                },
              ],
              schedules: [],
              pricing: {},
            },
            availability,
          })),
          loading: false,
        }))

        await xaelService.cleanup()
      } catch (error) {
        setSearchState((prev) => ({
          ...prev,
          error: 'Error fetching flights. Please try again.',
          loading: false,
        }))
      }
    }

    fetchResults()
  }, [searchState.searchParams])

  // Apply filters and sorting
  const filteredAndSortedResults = [...searchState.results]
    .filter((result) => {
      const { filters } = searchState
      if (filters.charter && result.charter.id !== filters.charter) return false
      if (
        filters.maxPrice &&
        result.availability.pricing.regular.total > filters.maxPrice
      )
        return false
      if (
        filters.availabilityStatus &&
        result.availability.status !== filters.availabilityStatus
      )
        return false
      return true
    })
    .sort((a, b) => {
      const { option, direction } = searchState.sort
      const modifier = direction === 'asc' ? 1 : -1

      switch (option) {
        case 'price':
          return (
            (a.availability.pricing.regular.total -
              b.availability.pricing.regular.total) *
            modifier
          )
        case 'departure':
          return (
            (new Date(a.availability.schedule.departure).getTime() -
              new Date(b.availability.schedule.departure).getTime()) *
            modifier
          )
        case 'availability':
          return (
            (b.availability.seatsAvailable - a.availability.seatsAvailable) *
            modifier
          )
        case 'charter':
          return a.charter.title.localeCompare(b.charter.title) * modifier
        default:
          return 0
      }
    })

  // Calculate validity period (15 minutes)
  const validUntil = addMinutes(searchState.timestamp, 15)
  const [isValid, setIsValid] = useState(true)

  // Check result validity
  useEffect(() => {
    const checkValidity = () => {
      setIsValid(isBefore(new Date(), validUntil))
    }

    const timer = setInterval(checkValidity, 1000)
    return () => clearInterval(timer)
  }, [validUntil])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search summary */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Flight Results
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {searchState.searchParams.origin} to{' '}
                {searchState.searchParams.destination} •{' '}
                {format(
                  new Date(searchState.searchParams.date),
                  'MMM dd, yyyy'
                )}{' '}
                • {searchState.searchParams.passengers}{' '}
                {searchState.searchParams.passengers === 1
                  ? 'passenger'
                  : 'passengers'}
              </p>
            </div>
            {/* Validity timer */}
            <div
              className={`text-sm ${
                isValid ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isValid ? (
                <div>Results valid until: {format(validUntil, 'HH:mm:ss')}</div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Results expired</span>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Filters */}
          <div className="col-span-1">
            <FlightFilters
              onFilterChange={(filters: FilterOptions) =>
                setSearchState((prev) => ({
                  ...prev,
                  filters: { ...prev.filters, ...filters },
                }))
              }
              availableCharters={['xael', 'cubazul', 'invicta']}
              minPrice={0}
              maxPrice={1000}
            />
          </div>

          {/* Results */}
          <div className="col-span-3">
            <FlightSort
              onSort={(option: SortOption, direction: SortDirection) =>
                setSearchState((prev) => ({
                  ...prev,
                  sort: { option, direction },
                }))
              }
              currentSort={searchState.sort}
            />

            <div className="mt-4 space-y-4">
              {searchState.loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                      Searching for flights...
                    </p>
                  </div>
                </div>
              ) : searchState.error ? (
                <div className="text-center text-red-600">
                  {searchState.error}
                </div>
              ) : (
                filteredAndSortedResults.map((result, index) => (
                  <FlightCard
                    key={`${result.charter.id}-${index}`}
                    charter={result.charter}
                    availability={result.availability}
                    onSelect={(
                      charter: Charter,
                      availability: FlightAvailability
                    ) => {
                      // Handle flight selection
                      console.log('Selected flight:', { charter, availability })
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
