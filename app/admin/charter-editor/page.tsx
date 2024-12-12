'use client'

import React, { useState, useEffect, useRef } from 'react'
import PriceSheet from './components/sheets/PriceSheet'
import EditorToolbar from './components/controls/EditorToolbar'
import { initialCharterData } from './data/charterData'
import { initialGlobalProfit } from './constants/defaults'
import type { CharterData, GlobalProfit } from './types'
import { toPng } from 'html-to-image'
import Toast from './components/ui/toast'
import { storageManager } from './utils/storage'

export default function CharterEditorPage() {
  const [charters, setCharters] = useState<CharterData[]>(initialCharterData)
  const [globalProfit, setGlobalProfit] =
    useState<GlobalProfit>(initialGlobalProfit)
  const [agencyLogo, setAgencyLogo] = useState<string>('')
  const [promotionalImage, setPromotionalImage] = useState<string>('')
  const [selectedDestination, setSelectedDestination] =
    useState<string>('MIA-HAV')
  const [selectedCharterIndex, setSelectedCharterIndex] = useState<number>(-1)
  const [isInitialized, setIsInitialized] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    const initializeData = async () => {
      await storageManager.initialize()
      const savedData = storageManager.getData()
      if (savedData) {
        setCharters(savedData.charters)
        setGlobalProfit(savedData.globalProfit)
        setAgencyLogo(savedData.agencyLogo || '')
        setPromotionalImage(savedData.promotionalImage || '')
        setSelectedDestination(savedData.selectedDestination)
        setSelectedCharterIndex(savedData.selectedCharterIndex)
        showNotification('success', 'Datos cargados correctamente')
      }
      setIsInitialized(true)
    }
    initializeData()
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    const autoSave = async () => {
      const success = await storageManager.saveData({
        charters,
        globalProfit,
        agencyLogo,
        promotionalImage,
        lastUpdated: new Date().toISOString(),
        selectedDestination,
        selectedCharterIndex,
      })
      if (!success) {
        showNotification('error', 'Error al guardar los datos')
      }
    }
    const timeoutId = setTimeout(autoSave, 500)
    return () => clearTimeout(timeoutId)
  }, [
    isInitialized,
    charters,
    globalProfit,
    agencyLogo,
    promotionalImage,
    selectedDestination,
    selectedCharterIndex,
  ])

  const handleDestinationChange = (destination: string) => {
    setSelectedDestination(destination)
    const charterIndex = charters.findIndex((charter) =>
      charter.destinations.some((dest) => dest.destination === destination)
    )
    setSelectedCharterIndex(charterIndex)
  }

  const handleCharterUpdate = (updatedCharters: CharterData[]) => {
    setCharters(updatedCharters)
  }

  const handleSelectCharter = (index: number) => {
    setSelectedCharterIndex(index)
  }

  const handleDownload = async () => {
    if (!ref.current) return
    try {
      const dataUrl = await toPng(ref.current, {
        quality: 1,
        width: 800,
        height: ref.current.scrollHeight,
      })
      const link = document.createElement('a')
      link.download = `charter-prices-${new Date().toISOString().split('T')[0]}.png`
      link.href = dataUrl
      link.click()
      showNotification('success', 'Imagen descargada exitosamente')
    } catch (error) {
      console.error('Error generating image:', error)
      showNotification('error', 'Error al descargar la imagen')
    }
  }

  const handleSave = async () => {
    const success = await storageManager.saveData({
      charters,
      globalProfit,
      agencyLogo,
      promotionalImage,
      lastUpdated: new Date().toISOString(),
      selectedDestination,
      selectedCharterIndex,
    })
    if (success) {
      showNotification('success', 'Datos guardados exitosamente')
    } else {
      showNotification('error', 'Error al guardar los datos')
    }
  }

  const handleLoad = () => {
    const data = storageManager.getData()
    if (data) {
      setCharters(data.charters)
      setGlobalProfit(data.globalProfit)
      setAgencyLogo(data.agencyLogo || '')
      setPromotionalImage(data.promotionalImage || '')
      setSelectedDestination(data.selectedDestination)
      setSelectedCharterIndex(data.selectedCharterIndex)
      showNotification('success', 'Datos cargados exitosamente')
    } else {
      showNotification('error', 'No hay datos guardados')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Editor Panel */}
      <div className="w-[450px] h-screen overflow-y-auto bg-gray-800 border-r border-gray-700 flex-shrink-0">
        <EditorToolbar
          charters={charters}
          globalProfit={globalProfit}
          onCharterUpdate={handleCharterUpdate}
          onGlobalProfitChange={setGlobalProfit}
          onDownload={handleDownload}
          onSave={handleSave}
          onLoad={handleLoad}
          onAgencyLogoChange={setAgencyLogo}
          onPromotionalImageChange={setPromotionalImage}
          selectedDestination={selectedDestination}
          onDestinationChange={handleDestinationChange}
          selectedCharterIndex={selectedCharterIndex}
          onSelectCharter={handleSelectCharter}
        />
      </div>

      {/* Preview Panel */}
      <div className="flex-1 h-screen overflow-y-auto">
        <div className="p-8">
          {/* The PriceSheet is centered and maintains its width without shrinking */}
          <div ref={ref} className="mx-auto">
            <PriceSheet
              charters={charters}
              globalProfit={globalProfit}
              agencyLogo={agencyLogo}
              promotionalImage={promotionalImage}
              selectedDestination={selectedDestination}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
