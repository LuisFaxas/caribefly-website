'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebaseConfig'
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore'
import { useAuth } from '@/contexts/AuthContext'
import PriceEditor from './components/editors/PriceEditor'
import EditorToolbar from './components/controls/EditorToolbar'
import PriceSheet from './components/sheets/PriceSheet'
import type { CharterData, GlobalProfit } from '@/types/charter'

export default function PriceManagementPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  const [charters, setCharters] = useState<CharterData[]>([])
  const [selectedDestination, setSelectedDestination] =
    useState<string>('MIA-HAV')
  const [selectedCharterIndex, setSelectedCharterIndex] = useState<number>(-1)
  const [loading, setLoading] = useState(true)
  const [agencyLogo, setAgencyLogo] = useState<string>('')
  const [promotionalImage, setPromotionalImage] = useState<string>('')
  const [globalProfit, setGlobalProfit] = useState<GlobalProfit>({
    rt: 20,
    ow: 20,
  })

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/admin/auth/login')
      return
    }

    setLoading(true)
    const unsubscribe = onSnapshot(collection(db, 'charters'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CharterData[]
      setCharters(data)
      setLoading(false)
    })

    return () => {
      unsubscribe()
      setLoading(false)
    }
  }, [user, isAdmin, router])

  useEffect(() => {
    setSelectedCharterIndex(-1)
  }, [selectedDestination])

  const handleCharterUpdate = (updatedCharters: CharterData[]) => {
    setCharters(updatedCharters)
  }

  const handleGlobalProfitChange = (profit: GlobalProfit) => {
    setGlobalProfit(profit)
  }

  const handleAgencyLogoChange = (logo: string) => {
    setAgencyLogo(logo)
  }

  const handlePromotionalImageChange = (image: string) => {
    setPromotionalImage(image)
  }

  const handleSave = async () => {
    try {
      const chartersRef = collection(db, 'charters')
      for (const charter of charters) {
        const { id, ...charterData } = charter
        await setDoc(doc(chartersRef, id), charterData)
      }
    } catch (error) {
      console.error('Error saving charters:', error)
    }
  }

  const handleDownload = () => {
    try {
      const dataStr = JSON.stringify({ charters, globalProfit }, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `charter-prices-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading data:', error)
    }
  }

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string
          const data = JSON.parse(content)
          if (data.charters) {
            setCharters(data.charters)
          }
          if (data.globalProfit) {
            setGlobalProfit(data.globalProfit)
          }
        } catch (error) {
          console.error('Error parsing file:', error)
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error('Error loading file:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
          />
        </div>
      </div>
    </div>
  )
}
