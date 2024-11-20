//app/admin/dashboard/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebaseConfig'
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  DocumentData,
} from 'firebase/firestore'
import ChartersManager from '../components/ChartersManager'
import ServicesManager from '../components/ServicesManager'
import FlightTabsManager from '../components/FlightTabsManager'
import type { Charter, Service } from '@/types/flight'
import type {
  FlightTab,
  Promotion,
  Announcement,
  DashboardData,
} from '@/types/dashboard'

// Initial dashboard metrics
const initialDashboardData: DashboardData = {
  totalFlights: 0,
  activePromotions: 0,
  activeAnnouncements: 0,
  recentBookings: 0,
  metrics: {
    daily: {
      bookings: 0,
      revenue: 0,
      visitors: 0,
    },
    weekly: {
      bookings: 0,
      revenue: 0,
      visitors: 0,
    },
    monthly: {
      bookings: 0,
      revenue: 0,
      visitors: 0,
    },
  },
}

type CollectionData = {
  services: Service[]
  charters: Charter[]
  flightTabs: FlightTab[]
  promotions: Promotion[]
  announcements: Announcement[]
}

type CollectionType = keyof CollectionData

const transformDoc = (doc: DocumentData) => {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    ...(data.validFrom && {
      validFrom: data.validFrom.toDate(),
    }),
    ...(data.validUntil && {
      validUntil: data.validUntil.toDate(),
    }),
  }
}

export default function AdminDashboard() {
  const { user, loading, isAdmin, signOut } = useAuth()
  const router = useRouter()

  // State Management
  const [activeSection, setActiveSection] = useState<string>('overview')
  const [services, setServices] = useState<Service[]>([])
  const [charters, setCharters] = useState<Charter[]>([])
  const [flightTabs, setFlightTabs] = useState<FlightTab[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dashboardData, setDashboardData] =
    useState<DashboardData>(initialDashboardData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Navigation Items
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: 'ChartPieIcon' },
    { id: 'flight-tabs', label: 'Flight Tabs', icon: 'TableCellsIcon' },
    { id: 'charters', label: 'Charters', icon: 'AirplaneIcon' },
    { id: 'services', label: 'Services', icon: 'BuildingStorefrontIcon' },
    { id: 'settings', label: 'Settings', icon: 'Cog6ToothIcon' },
  ]

  // Generic save handler for collections
  const handleSave = async (
    collectionName: string,
    data: any,
    id: string
  ): Promise<void> => {
    setIsSaving(true)
    try {
      const docRef = doc(db, collectionName, id)
      await setDoc(docRef, data, { merge: true })
    } catch (error) {
      setError(`Error saving ${collectionName}: ${error}`)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  // Collection-specific save handlers
  const handleSaveCharters = useCallback(async (updatedCharters: Charter[]) => {
    try {
      await Promise.all(
        updatedCharters.map((charter) =>
          handleSave('charters', charter, charter.id)
        )
      )
    } catch (error) {
      setError('Error saving charters')
    }
  }, [])

  const handleSaveServices = useCallback(async (updatedServices: Service[]) => {
    try {
      await Promise.all(
        updatedServices.map((service) =>
          handleSave('services', service, service.id)
        )
      )
    } catch (error) {
      setError('Error saving services')
    }
  }, [])

  const handleSaveFlightTabs = useCallback(async (tabs: FlightTab[]) => {
    try {
      await handleSave('flightTabs', { tabs }, 'flightTabs')
    } catch (error) {
      setError('Error saving flight tabs')
    }
  }, [])

  // Fetch Firestore Data
  useEffect(() => {
    if (!user || !isAdmin) return

    // Handle regular collections
    const regularCollections = [
      { name: 'services', setter: setServices },
      { name: 'charters', setter: setCharters },
      { name: 'promotions', setter: setPromotions },
      { name: 'announcements', setter: setAnnouncements },
    ]

    const unsubscribers = regularCollections.map(({ name, setter }) =>
      onSnapshot(
        collection(db, name),
        (snapshot) => {
          const data = snapshot.docs.map(transformDoc)
          setter(data)
        },
        (error) => {
          console.error(`Error fetching ${name}:`, error)
          setError(`Error loading ${name}`)
        }
      )
    )

    // Handle flightTabs separately since it's a single document with an array
    const flightTabsUnsubscriber = onSnapshot(
      doc(db, 'flightTabs', 'flightTabs'),
      (snapshot) => {
        const data = snapshot.data()
        if (data && Array.isArray(data.tabs)) {
          setFlightTabs(data.tabs.map(tab => ({
            ...tab,
            widgets: tab.widgets || [] // Ensure widgets is always an array
          })))
        } else {
          setFlightTabs([]) // Set empty array if no data
        }
      },
      (error) => {
        console.error('Error fetching flight tabs:', error)
        setError('Error loading flight tabs')
      }
    )

    setIsLoading(false)

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
      flightTabsUnsubscriber()
    }
  }, [user, isAdmin])

  // Auth check effect
  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        router.replace('/admin/auth/login')
      }
    }
  }, [user, isAdmin, loading, router])

  // Loading check
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  // If not authenticated, render nothing while redirecting
  if (!user || !isAdmin) {
    return null
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'flight-tabs':
        return (
          <FlightTabsManager
            tabs={flightTabs}
            onUpdate={handleSaveFlightTabs}
          />
        )
      case 'charters':
        return (
          <ChartersManager charters={charters} onUpdate={handleSaveCharters} />
        )
      case 'services':
        return (
          <ServicesManager services={services} onUpdate={handleSaveServices} />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              CaribeFly Admin
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Logged in as: <span className="font-medium">{user.email}</span>
              </span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-sm">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Notifications */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {isSaving && (
            <div className="mb-6 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">Saving changes...</span>
            </div>
          )}

          {/* Active Section Content */}
          <div className="bg-white rounded-lg shadow">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  )
}
