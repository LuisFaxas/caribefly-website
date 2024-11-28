'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebaseConfig'
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore'
import { useAuth } from '@/contexts/AuthContext'
import PriceEditor from './components/editors/PriceEditor'
import EditorToolbar from './components/controls/EditorToolbar'
import PriceSheet from './components/sheets/PriceSheet'
import LoadingState from './components/controls/LoadingState'
import ErrorBoundary from './components/controls/ErrorBoundary'
import type { CharterData, GlobalProfit } from '@/types/charter'
import toast from 'react-hot-toast'

export default function PriceManagementPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  const [charters, setCharters] = useState<CharterData[]>([])
  const [selectedDestination, setSelectedDestination] = useState<string>('MIA-HAV')
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
        collection(db, 'charters'),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as CharterData[]
          setCharters(data)
          setLoading(false)
        },
        (err) => {
          console.error('Error loading charters:', err)
          setError('Failed to load charter data')
          setLoading(false)
        }
      )

      return () => {
        unsubscribe()
      }
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

  // Data management handlers
  const handleSave = async () => {
    if (!user) return

    try {
      const charterRef = doc(db, 'charters', user.uid)
      await setDoc(charterRef, { charters, globalProfit }, { merge: true })
      toast.success('Changes saved successfully')
    } catch (error) {
      console.error('Error saving changes:', error)
      toast.error('Failed to save changes')
    }
  }

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (!data.charters || !Array.isArray(data.charters)) {
        throw new Error('Invalid file format: missing or invalid charters data')
      }

      setCharters(data.charters)
      
      if (data.globalProfit?.rt && data.globalProfit?.ow) {
        setGlobalProfit(data.globalProfit)
      }
      
      toast.success('Data loaded successfully')
    } catch (error) {
      console.error('Error loading file:', error)
      toast.error('Failed to load file: ' + (error as Error).message)
    }
  }

  const handleDownload = async () => {
    try {
      const data = {
        charters,
        globalProfit,
        timestamp: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `charter-prices-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('File downloaded successfully')
    } catch (error) {
      console.error('Error downloading file:', error)
      toast.error('Failed to download file')
    }
  }

  // Update handlers
  const handleCharterUpdate = (updatedCharters: CharterData[]) => {
    setCharters(updatedCharters)
  }

  const handleGlobalProfitChange = (profit: GlobalProfit) => {
    setGlobalProfit(profit)
  }

  // File upload handlers
  const handleFileUpload = async (
    file: File,
    setter: (value: string) => void
  ) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setter(reader.result as string)
      }
      reader.onerror = () => {
        toast.error('Failed to read file')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
    }
  }

  const handleAgencyLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file, setAgencyLogo)
    }
  }

  const handlePromotionalImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file, setPromotionalImage)
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
              <LoadingState type="editor" />
            </div>
            <div className="col-span-9">
              <LoadingState type="editor" />
            </div>
          </div>
          <div className="mt-6">
            <LoadingState type="sheet" />
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

        <ErrorBoundary>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <EditorToolbar
                charters={charters}
                globalProfit={globalProfit}
                onCharterUpdate={handleCharterUpdate}
                onGlobalProfitChange={handleGlobalProfitChange}
                onDownload={handleDownload}
                onSave={handleSave}
                onLoad={handleLoad}
                onAgencyLogoChange={handleAgencyLogoChange}
                onPromotionalImageChange={handlePromotionalImageChange}
                selectedDestination={selectedDestination}
                onDestinationChange={setSelectedDestination}
                selectedCharterIndex={selectedCharterIndex}
                onSelectCharter={setSelectedCharterIndex}
              />
            </div>

            <div className="col-span-9">
              {selectedCharterIndex >= 0 ? (
                <PriceEditor
                  charters={charters}
                  selectedDestination={selectedDestination}
                  selectedCharterIndex={selectedCharterIndex}
                  globalProfit={globalProfit}
                  onCharterUpdate={handleCharterUpdate}
                />
              ) : (
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                  <p className="text-gray-400">
                    Select a charter and destination to start editing
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <PriceSheet
              charters={charters}
              selectedDestination={selectedDestination}
              agencyLogo={agencyLogo}
              promotionalImage={promotionalImage}
              isLoading={loading}
            />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  )
}
