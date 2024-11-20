// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import FlightSearch from './components/FlightSearch'
import FlightTabContent from './components/flights/FlightTabContent'
import type { Charter, Service, SearchParams } from '@/types/flight'
import type { FlightTab } from '@/types/dashboard'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [activeTab, setActiveTab] = useState<string>('flights')
  const [flightTabs, setFlightTabs] = useState<FlightTab[]>([])
  const [tabData, setTabData] = useState<any>({}) // We'll type this properly

  // Fetch initial data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services and flight tabs
        const servicesSnapshot = await getDocs(collection(db, 'services'))
        const servicesData = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[]
        setServices(servicesData)

        // Fetch flight tabs configuration
        const flightTabsSnapshot = await getDocs(collection(db, 'flightTabs'))
        const flightTabsData = flightTabsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FlightTab[]
        setFlightTabs(flightTabsData)

        // Fetch tab content data
        const chartersSnapshot = await getDocs(collection(db, 'charters'))
        const promotionsSnapshot = await getDocs(collection(db, 'promotions'))
        const announcementsSnapshot = await getDocs(
          collection(db, 'announcements')
        )

        setTabData({
          charters: chartersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          promotions: promotionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          announcements: announcementsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle flight search
  const handleSearch = async (params: SearchParams) => {
    // Redirect to search results page with query parameters
    const searchParams = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      date: params.departureDate.toISOString(),
      passengers: params.passengers.toString(),
      tripType: params.tripType,
    })

    router.push(`/search?${searchParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-700">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-700">
      {/* Header section */}
      <header className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 text-center md:text-left">
          CaribeFly
        </h1>
        <div className="mt-2 md:mt-0 space-x-2 flex justify-center">
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
          >
            Log In
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero section with search */}
      <div className="relative bg-white shadow-lg rounded-b-3xl p-6 md:p-10 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          Your Gateway to Cuba - Flights, Hotels, Rentals & More
        </h1>
        <FlightSearch onSearch={handleSearch} />
      </div>

      {/* Services section */}
      <div className="container mx-auto mt-8 md:mt-10 px-4 md:px-0">
        {/* Service tabs */}
        <div className="flex overflow-x-auto space-x-2 md:space-x-4 mb-4 md:mb-6 justify-start snap-x snap-mandatory">
          {services.map((service) => (
            <button
              key={service.id}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-lg font-semibold transition whitespace-nowrap snap-start ${
                activeTab === service.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(service.id)}
            >
              {service.title}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'flights' && (
          <div className="bg-gradient-to-br from-white to-blue-50 p-4 md:p-8 rounded-xl shadow-md">
            {flightTabs.map((tab) => (
              <FlightTabContent key={tab.id} tab={tab} data={tabData} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 md:mt-16 bg-blue-600 text-white py-4 text-center text-sm md:text-base">
        {new Date().getFullYear()} CaribeFly - Your Travel Partner to Cuba
      </footer>
    </div>
  )
}
