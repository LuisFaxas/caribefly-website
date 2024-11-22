'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import { useAuth } from '@/contexts/AuthContext'
import PriceEditor from './components/editors/PriceEditor'
import EditorToolbar from './components/controls/EditorToolbar'
import PriceSheet from './components/sheets/PriceSheet'
import type { CharterData } from '@/types/charter'

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

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/admin/auth/login')
      return
    }

    const unsubscribe = onSnapshot(collection(db, 'charters'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CharterData[]
      setCharters(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, isAdmin, router])

  const handleCharterUpdate = (updatedCharters: CharterData[]) => {
    setCharters(updatedCharters)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Charter Price Management</h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Toolbar */}
          <div className="col-span-3">
            <EditorToolbar
              charters={charters}
              selectedDestination={selectedDestination}
              onDestinationChange={setSelectedDestination}
              selectedCharterIndex={selectedCharterIndex}
              onSelectCharter={setSelectedCharterIndex}
              onCharterUpdate={handleCharterUpdate}
              onAgencyLogoChange={setAgencyLogo}
              onPromotionalImageChange={setPromotionalImage}
              onSave={() => console.log('Save clicked')}
              onLoad={() => console.log('Load clicked')}
              onDownload={() => console.log('Download clicked')}
              globalProfit={{}}
              onGlobalProfitChange={() => {}}
            />
          </div>

          {/* Editor */}
          <div className="col-span-9">
            {selectedCharterIndex >= 0 ? (
              <PriceEditor
                charters={charters}
                selectedDestination={selectedDestination}
                selectedCharterIndex={selectedCharterIndex}
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

        {/* Price Sheet Preview */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Price Sheet Preview</h2>
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
