'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebaseConfig'
import { doc, onSnapshot, setDoc, collection, getDocs } from 'firebase/firestore'
import { useAuth } from '@/contexts/AuthContext'
import PriceEditor from './components/editors/PriceEditor'
import EditorToolbar from './components/controls/EditorToolbar'
import PriceSheet from './components/sheets/PriceSheet'
import LoadingState from './components/controls/LoadingState'
import ErrorBoundary from './components/controls/ErrorBoundary'
import type {
  CharterData,
  DestinationData,
  GlobalProfit,
  StorageData,
} from '@/types/charter'
import { cubanAirports, floridaAirports } from '@/data/airportCodes'
import toast from 'react-hot-toast'
import crypto from 'crypto'

// Initialize new charter data with all routes
const initializeNewCharter = (name: string): CharterData => {
  const routes = floridaAirports.flatMap((from) =>
    cubanAirports.map((to) => `${from}-${to}`)
  )

  const today = new Date()
  const nextMonth = new Date(today)
  nextMonth.setMonth(today.getMonth() + 1)

  return {
    id: crypto.randomUUID(),
    name,
    destinations: routes.map((route) => ({
      destination: route,
      flightDays: ['Lunes', 'Miércoles', 'Viernes'],
      flightTimes: [{ ida: '10:00', regreso: '13:00' }],
      periods: [
        {
          label: 'Temporada Regular',
          startDate: today.toISOString(),
          endDate: nextMonth.toISOString(),
          rt: 299,
          ow: 199,
        },
      ],
      baggageInfo: [
        'Equipaje de mano incluido',
        'Primera maleta: $1.40/lb',
        'Maletas adicionales: $2.70/lb',
      ],
      additionalInfo: [
        'Impuestos USA incluidos',
        'Tasa de salida: $27',
        'Tasa sanitaria: $35',
        'Cargo por reserva: $9',
      ],
    })),
    globalProfit: {
      rt: 40,
      ow: 30,
    },
  }
}

export default function PriceManagementPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  // Initialize state
  const [charters, setCharters] = useState<CharterData[]>([])
  const [selectedCharterIndex, setSelectedCharterIndex] = useState<number>(-1)
  const [selectedDestination, setSelectedDestination] = useState<string>('')
  const [globalProfit, setGlobalProfit] = useState<GlobalProfit>({
    rt: 40,
    ow: 30,
  })
  const [agencyLogo, setAgencyLogo] = useState<string>('')
  const [promotionalImage, setPromotionalImage] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load charters from Firestore
  useEffect(() => {
    const loadCharters = async () => {
      try {
        const chartersRef = collection(db, 'charters')
        const snapshot = await getDocs(chartersRef)
        const loadedCharters = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as CharterData)
        )
        setCharters(loadedCharters)
        
        // Set initial selection if charters exist
        if (loadedCharters.length > 0) {
          setSelectedCharterIndex(0)
          const firstCharter = loadedCharters[0]
          if (firstCharter.destinations?.length > 0) {
            setSelectedDestination(firstCharter.destinations[0].destination)
          }
        }
      } catch (error) {
        console.error('Error loading charters:', error)
        toast.error('Error loading charters')
      } finally {
        setLoading(false)
      }
    }

    loadCharters()
  }, [])

  // Authentication and data loading
  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/admin/auth/login')
      return
    }

    try {
      const unsubscribe = onSnapshot(
        doc(db, 'charters', user.uid),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as StorageData
            const charterData = data.charters || [initializeNewCharter('Enjoy')]
            setCharters(charterData)
            setGlobalProfit(data.globalProfit || { rt: 40, ow: 30 })
            setAgencyLogo(data.agencyLogo || '')
            setPromotionalImage(data.promotionalImage || '')

            // Always ensure we have a valid selected destination
            if (
              charterData.length > 0 &&
              charterData[0].destinations?.length > 0
            ) {
              setSelectedDestination(charterData[0].destinations[0].destination)
              setSelectedCharterIndex(0)
            }
          } else {
            // Initialize with default data if no document exists
            const defaultCharter = initializeNewCharter('Enjoy')
            const defaultData = {
              charters: [defaultCharter],
              globalProfit: { rt: 40, ow: 30 },
              agencyLogo: '',
              promotionalImage: '',
            }

            // Save default data to Firestore
            setDoc(doc(db, 'charters', user.uid), defaultData).catch(
              (error) => {
                console.error('Error saving default charter data:', error)
                toast.error('Error saving default data')
              }
            )

            setCharters([defaultCharter])
            setSelectedDestination(defaultCharter.destinations[0].destination)
            setSelectedCharterIndex(0)
          }
        },
        (error) => {
          console.error('Error loading charter data:', error)
          setError(
            'Error loading charter data. Please try refreshing the page.'
          )
        }
      )

      return () => unsubscribe()
    } catch (error) {
      console.error('Error setting up snapshot listener:', error)
      setError(
        'Error connecting to the database. Please try refreshing the page.'
      )
    }
  }, [user, isAdmin, router])

  // Reset selection when charters change
  useEffect(() => {
    if (!charters || !Array.isArray(charters)) return

    if (charters.length > 0 && selectedCharterIndex === -1) {
      setSelectedCharterIndex(0)
      const firstCharter = charters[0]
      if (firstCharter?.destinations?.length > 0) {
        setSelectedDestination(firstCharter.destinations[0].destination)
      }
    }
  }, [charters, selectedCharterIndex])

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
      }

      await setDoc(charterRef, dataToSave)
      toast.success('Changes saved successfully')
    } catch (error) {
      console.error('Error saving changes:', error)
      toast.error('Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  const handleCharterUpdate = (updatedCharter: CharterData) => {
    const newCharters = [...charters]
    newCharters[selectedCharterIndex] = updatedCharter
    setCharters(newCharters)
  }

  const handleDestinationUpdate = (updatedDestinationData: DestinationData) => {
    if (selectedCharterIndex >= 0) {
      const updatedCharter = { ...charters[selectedCharterIndex] }
      const destinationIndex = updatedCharter.destinations.findIndex(
        (d) => d.destination === selectedDestination
      )

      if (destinationIndex >= 0) {
        updatedCharter.destinations[destinationIndex] = updatedDestinationData
        handleCharterUpdate(updatedCharter)
      }
    }
  }

  const getCurrentDestinationData = () => {
    if (selectedCharterIndex >= 0 && selectedDestination) {
      const charter = charters[selectedCharterIndex]
      return charter.destinations.find(
        (d) => d.destination === selectedDestination
      )
    }
    return null
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
                agencyLogo={agencyLogo}
                promotionalImage={promotionalImage}
              />
            </ErrorBoundary>
          </div>

          {/* Right Content Area */}
          <div className="col-span-9 space-y-6">
            {/* Editor Section */}
            <ErrorBoundary>
              {selectedCharterIndex >= 0 && getCurrentDestinationData() ? (
                <div className="bg-gray-800 rounded-lg p-6">
                  <PriceEditor
                    charter={charters[selectedCharterIndex]}
                    selectedDestination={selectedDestination}
                    globalProfit={globalProfit}
                    onUpdate={handleCharterUpdate}
                    onDestinationUpdate={handleDestinationUpdate}
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
