'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebaseConfig'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useAuth } from '@/contexts/AuthContext'
import PriceEditor from './components/editors/PriceEditor'
import EditorToolbar from './components/controls/EditorToolbar'
import PriceSheet from './components/sheets/PriceSheet'
import LoadingState from './components/controls/LoadingState'
import ErrorBoundary from './components/controls/ErrorBoundary'
import type { CharterData, GlobalProfit, StorageData } from '@/types/charter'
import { cubanAirports, floridaAirports } from '@/data/airportCodes'
import toast from 'react-hot-toast'

// Initialize new charter data with all routes
const initializeNewCharter = (name: string): CharterData => {
  const routes = floridaAirports.flatMap(from => 
    cubanAirports.map(to => `${from}-${to}`)
  )
  
  return {
    name,
    destinations: routes.map(route => ({
      destination: route,
      flightDays: ['Monday', 'Wednesday', 'Friday'],
      flightTimes: [{ ida: '10:00', regreso: '13:00' }],
      periods: [{
        label: 'Regular Season',
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        rt: 299,
        ow: 199
      }],
      baggageInfo: ['1 carry-on included', '1 checked bag included'],
      additionalInfo: ['Valid for 6 months', 'Subject to availability']
    }))
  }
}

export default function PriceManagementPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  // Initialize state
  const [charters, setCharters] = useState<CharterData[]>([])
  const [selectedDestination, setSelectedDestination] = useState<string>('')
  const [selectedCharterIndex, setSelectedCharterIndex] = useState<number>(-1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [agencyLogo, setAgencyLogo] = useState<string>('')
  const [promotionalImage, setPromotionalImage] = useState<string>('')
  const [globalProfit, setGlobalProfit] = useState<GlobalProfit>({
    rt: 20,
    ow: 20,
  })

  // Authentication and data loading
  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/admin/auth/login')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const unsubscribe = onSnapshot(
        doc(db, 'charters', user.uid),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as StorageData
            setCharters(data.charters || [initializeNewCharter('Charter sin nombre')])
            setGlobalProfit(data.globalProfit || { rt: 20, ow: 20 })
            setAgencyLogo(data.agencyLogo || '')
            setPromotionalImage(data.promotionalImage || '')
            
            // Set destination only if we have charters
            if (data.charters?.length > 0 && data.charters[0].destinations?.length > 0) {
              setSelectedDestination(data.charters[0].destinations[0].destination)
              setSelectedCharterIndex(0)
            }
            setLoading(false)
          } else {
            // Initialize with default data if no document exists
            const defaultCharter = initializeNewCharter('Charter sin nombre')
            setCharters([defaultCharter])
            setSelectedDestination(defaultCharter.destinations[0].destination)
            setSelectedCharterIndex(0)
            setLoading(false)
          }
        },
        (error) => {
          console.error('Error loading charter data:', error)
          setError('Error loading charter data. Please try refreshing the page.')
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.error('Error setting up charter listener:', err)
      setError('Failed to initialize charter management')
      setLoading(false)
    }
  }, [user, isAdmin, router])

  // Reset selection when destination changes
  useEffect(() => {
    setSelectedCharterIndex(-1)
  }, [selectedDestination])

  // Handlers
  const handleSave = async () => {
    if (!user) return

    try {
      setLoading(true)
      const charterRef = doc(db, 'charters', user.uid)
      const dataToSave: StorageData = {
        charters,
        globalProfit,
        agencyLogo,
        promotionalImage,
        lastUpdated: new Date().toISOString(),
        selectedDestination,
        selectedCharterIndex
      }
      
      await setDoc(charterRef, dataToSave, { merge: true })
      toast.success('Changes saved successfully')
    } catch (error) {
      console.error('Error saving changes:', error)
      toast.error('Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Charter Price Management</h1>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <LoadingState />
            </div>
            <div className="col-span-9">
              <LoadingState />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Charter Price Management</h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Toolbar */}
          <div className="col-span-3 space-y-6">
            <ErrorBoundary>
              <EditorToolbar
                charters={charters}
                globalProfit={globalProfit}
                onCharterUpdate={setCharters}
                onGlobalProfitChange={setGlobalProfit}
                onDownload={() => {}}
                onSave={handleSave}
                onLoad={() => {}}
                onAgencyLogoChange={setAgencyLogo}
                onPromotionalImageChange={setPromotionalImage}
                selectedDestination={selectedDestination}
                onDestinationChange={setSelectedDestination}
                selectedCharterIndex={selectedCharterIndex}
                onSelectCharter={setSelectedCharterIndex}
              />
            </ErrorBoundary>
          </div>

          {/* Right Content Area */}
          <div className="col-span-9 space-y-6">
            {/* Editor Section */}
            <ErrorBoundary>
              {selectedCharterIndex >= 0 ? (
                <div className="bg-gray-800 rounded-lg p-6">
                  <PriceEditor
                    charter={charters[selectedCharterIndex]}
                    selectedDestination={selectedDestination}
                    globalProfit={globalProfit}
                    onUpdate={(updatedCharter) => {
                      const newCharters = [...charters]
                      newCharters[selectedCharterIndex] = updatedCharter
                      setCharters(newCharters)
                    }}
                  />
                </div>
              ) : (
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                  <p className="text-gray-400">
                    Select a charter and destination to start editing
                  </p>
                </div>
              )}
            </ErrorBoundary>

            {/* Price Sheet Section */}
            <ErrorBoundary>
              <div className="bg-gray-800 rounded-lg p-6">
                <PriceSheet
                  charters={charters}
                  selectedDestination={selectedDestination}
                  globalProfit={globalProfit}
                  agencyLogo={agencyLogo}
                  promotionalImage={promotionalImage}
                />
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}
