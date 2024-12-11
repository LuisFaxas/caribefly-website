// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import FlightSearch from './components/FlightSearch'
import FlightTabContent from './components/flights/FlightTabContent'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ServiceTabs from './components/services/ServiceTabs'
import type { Charter, Service, SearchParams } from '@/types/flight'
import type { FlightTab } from '@/types/dashboard'
import type { TabData } from '@/types/firebase'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [activeTab, setActiveTab] = useState<string>('flights')
  const [flightTabs, setFlightTabs] = useState<FlightTab[]>([])
  const [tabData, setTabData] = useState<TabData>({
    charters: [],
    promotions: [],
    announcements: [],
  })

  // Fetch initial data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch services and flight tabs
        const [
          servicesSnapshot,
          flightTabsSnapshot,
          chartersSnapshot,
          promotionsSnapshot,
          announcementsSnapshot,
        ] = await Promise.all([
          getDocs(collection(db, 'services')),
          getDocs(collection(db, 'flightTabs')),
          getDocs(collection(db, 'charters')),
          getDocs(collection(db, 'promotions')),
          getDocs(collection(db, 'announcements')),
        ])

        setServices(
          servicesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Service[]
        )

        setFlightTabs(
          flightTabsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as FlightTab[]
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
        } as TabData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please try refreshing the page.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-700"
        role="alert"
        aria-live="assertive"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            aria-label="Retry loading the page"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-700"
        role="status"
        aria-live="polite"
      >
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-700">
      <Header />

      {/* Hero section with search */}
      <main>
        <div className="relative bg-white shadow-lg rounded-b-3xl p-6 md:p-10 mt-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
            Your Gateway to Cuba - Flights, Hotels, Rentals & More
          </h1>
          <FlightSearch onSearch={handleSearch} />
        </div>

        {/* Services section */}
        <section
          className="container mx-auto mt-8 md:mt-10 px-4 md:px-0"
          aria-label="Services"
        >
          <ServiceTabs
            services={services}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab content */}
          {activeTab === 'flights' && (
            <div
              className="bg-gradient-to-br from-white to-blue-50 p-4 md:p-8 rounded-xl shadow-md"
              role="tabpanel"
              aria-labelledby="flights-tab"
            >
              {flightTabs.map((tab) => (
                <FlightTabContent key={tab.id} tab={tab} data={tabData} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
