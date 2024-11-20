// app/admin/charter-editor/page.tsx

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { db } from '@/lib/firebaseConfig'
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore'
import PriceSheet from './components/sheets/PriceSheet'
import EditorToolbar from './components/controls/EditorToolbar'
import { initialCharterData } from '@/data/charterData'
import { initialGlobalProfit } from '@/constants/defaults'
import type {
  CharterData,
  GlobalProfit,
  StorageData,
  NotificationType,
} from '@/types/charter'
import { toPng } from 'html-to-image'
import { Toast } from '@/app/admin/components/ui'

export default function CharterEditor() {
  // State management
  const [charters, setCharters] = useState<CharterData[]>(initialCharterData)
  const [globalProfit, setGlobalProfit] =
    useState<GlobalProfit>(initialGlobalProfit)
  const [agencyLogo, setAgencyLogo] = useState<string>('')
  const [promotionalImage, setPromotionalImage] = useState<string>('')
  const [selectedDestination, setSelectedDestination] =
    useState<string>('MIA-HAV')
  const [selectedCharterIndex, setSelectedCharterIndex] = useState<number>(-1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  // Notification state
  const [notification, setNotification] = useState<{
    type: NotificationType
    message: string
  } | null>(null)

  // Subscribe to charter data changes from Firebase
  useEffect(() => {
    setLoading(true)
    setError(null)

    try {
      const unsubscribe = onSnapshot(
        collection(db, 'charters'),
        (snapshot) => {
          const charterData: CharterData[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            destinations: doc.data().destinations,
          }))

          if (charterData.length > 0) {
            setCharters(charterData)
            // Find first charter with current destination
            const charterIndex = charterData.findIndex((charter) =>
              charter.destinations.some(
                (dest) => dest.destination === selectedDestination
              )
            )
            setSelectedCharterIndex(charterIndex >= 0 ? charterIndex : 0)
          }
          setLoading(false)
        },
        (error) => {
          setError(error.message)
          setLoading(false)
          setNotification({
            type: 'error',
            message: `Error loading charters: ${error.message}`,
          })
        }
      )

      return () => unsubscribe()
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
      setLoading(false)
      setNotification({
        type: 'error',
        message: `Error setting up charter sync: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    }
  }, [selectedDestination])

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleDestinationChange = (destination: string) => {
    setSelectedDestination(destination)
    const charterIndex = charters.findIndex((charter) =>
      charter.destinations.some((dest) => dest.destination === destination)
    )
    setSelectedCharterIndex(charterIndex >= 0 ? charterIndex : 0)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const storageData: StorageData = {
        charters,
        globalProfit,
        agencyLogo,
        promotionalImage,
        lastUpdated: new Date().toISOString(),
        selectedDestination,
        selectedCharterIndex,
      }

      await setDoc(doc(db, 'settings', 'editorState'), storageData)
      showNotification('success', 'Changes saved successfully')
    } catch (error) {
      showNotification(
        'error',
        `Error saving changes: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (!ref.current) return

    try {
      const dataUrl = await toPng(ref.current, { quality: 0.95 })
      const link = document.createElement('a')
      link.download = `charter-prices-${selectedDestination}-${new Date().toISOString()}.png`
      link.href = dataUrl
      link.click()
      showNotification('success', 'Price sheet exported successfully')
    } catch (error) {
      showNotification(
        'error',
        `Error exporting price sheet: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  const handleImageUpload = async (type: 'logo' | 'promo', file: File) => {
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        if (type === 'logo') {
          setAgencyLogo(base64String)
          await setDoc(
            doc(db, 'settings', 'editorState'),
            { agencyLogo: base64String },
            { merge: true }
          )
        } else {
          setPromotionalImage(base64String)
          await setDoc(
            doc(db, 'settings', 'editorState'),
            { promotionalImage: base64String },
            { merge: true }
          )
        }
        showNotification(
          'success',
          `${type === 'logo' ? 'Logo' : 'Promotional image'} updated successfully`
        )
      }
      reader.readAsDataURL(file)
    } catch (error) {
      showNotification(
        'error',
        `Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading charter editor...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    )
  }

  const selectedCharter = charters[selectedCharterIndex]
  const selectedDestinationData = selectedCharter?.destinations.find(
    (dest) => dest.destination === selectedDestination
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex-1 p-4">
        <EditorToolbar
          charters={charters}
          selectedDestination={selectedDestination}
          selectedCharterIndex={selectedCharterIndex}
          globalProfit={globalProfit}
          onDestinationChange={handleDestinationChange}
          onCharterSelect={setSelectedCharterIndex}
          onGlobalProfitChange={setGlobalProfit}
          onSave={handleSave}
          onExport={handleExport}
          onImageUpload={handleImageUpload}
        />

        <div ref={ref} className="mt-8">
          {selectedDestinationData && (
            <PriceSheet
              charter={selectedCharter}
              destination={selectedDestinationData}
              globalProfit={globalProfit}
              agencyLogo={agencyLogo}
              promotionalImage={promotionalImage}
            />
          )}
        </div>
      </div>
    </div>
  )
}
