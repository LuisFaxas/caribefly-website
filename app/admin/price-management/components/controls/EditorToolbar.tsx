// src/components/controls/EditorToolbar.tsx

import React, { useRef, useMemo } from 'react'
import { Button, Input, Label, Select } from '@/app/components/ui'
import PriceEditor from '../editors/PriceEditor'
import type {
  CharterData,
  GlobalProfit,
  DestinationData,
} from '@/types/charter'
import { validateDestination } from '../../utils/validation'
import { FaSave, FaDownload, FaUpload } from 'react-icons/fa'

interface EditorToolbarProps {
  charters: CharterData[]
  globalProfit: GlobalProfit
  onCharterUpdate: (charters: CharterData[]) => void
  onGlobalProfitChange: (profit: GlobalProfit) => void
  onDownload: () => void
  onSave: () => void
  onLoad: () => void
  onAgencyLogoChange: (logo: string) => void
  onPromotionalImageChange: (image: string) => void
  selectedDestination: string
  onDestinationChange: (destination: string) => void
  selectedCharterIndex: number
  onSelectCharter: (index: number) => void
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  charters,
  globalProfit,
  onCharterUpdate,
  onGlobalProfitChange,
  onDownload,
  onSave,
  onLoad,
  onAgencyLogoChange,
  onPromotionalImageChange,
  selectedDestination,
  onDestinationChange,
  selectedCharterIndex,
  onSelectCharter,
}) => {
  const agencyLogoInputRef = useRef<HTMLInputElement>(null)
  const promotionalImageInputRef = useRef<HTMLInputElement>(null)

  // Get all unique destinations across all charters
  const allDestinations = useMemo(() => {
    const destinations = new Set<string>(['MIA-HAV']) // Always include MIA-HAV
    if (!charters?.length) return Array.from(destinations)

    charters.forEach((charter) => {
      charter?.destinations?.forEach((dest) => {
        if (dest?.destination) {
          destinations.add(dest.destination)
        }
      })
    })
    return Array.from(destinations).sort()
  }, [charters])

  // Get available charters for selected destination
  const availableCharters = useMemo(() => {
    if (!selectedDestination || !charters?.length) return []
    return charters.filter(
      (charter) =>
        charter?.destinations?.some?.(
          (dest) => dest?.destination === selectedDestination
        ) ?? false
    )
  }, [charters, selectedDestination])

  // Get current destination data
  const currentDestinationData = useMemo(() => {
    if (
      selectedCharterIndex < 0 ||
      !selectedDestination ||
      !charters?.[selectedCharterIndex]
    )
      return undefined
    return charters[selectedCharterIndex]?.destinations?.find?.(
      (dest) => dest?.destination === selectedDestination
    )
  }, [charters, selectedCharterIndex, selectedDestination])

  // File upload handler
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    callback: (result: string) => void
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Only image files are allowed')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.error('File size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        callback(reader.result as string)
      }
    }
    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }
    reader.readAsDataURL(file)
  }

  // Destination update handler
  const handleDestinationUpdate = (updatedDestData: DestinationData) => {
    if (!selectedDestination || selectedCharterIndex < 0) return

    const updatedCharters = [...charters]
    const charter = { ...updatedCharters[selectedCharterIndex] }
    charter.destinations = [...charter.destinations]
    updatedCharters[selectedCharterIndex] = charter

    const destIndex = charter.destinations.findIndex(
      (dest) => dest.destination === selectedDestination
    )

    if (destIndex >= 0) {
      // Validate the updated destination data
      const validationResult = validateDestination(updatedDestData)
      if (!validationResult.isValid) {
        console.error('Validation errors:', validationResult.errors)
        return
      }

      charter.destinations[destIndex] = {
        ...updatedDestData,
        lastUpdated: new Date().toISOString(),
      }
      onCharterUpdate(updatedCharters)
    }
  }

  return (
    <div className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-md text-white">
      {/* Destination Selector */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <Label
          htmlFor="destinationSelect"
          className="text-xl font-semibold mb-2 text-white"
        >
          Destino
        </Label>
        <Select
          id="destinationSelect"
          value={selectedDestination}
          onChange={(e) => onDestinationChange(e.target.value)}
          className="bg-gray-600 text-white"
          options={allDestinations.map((dest) => ({
            value: dest,
            label: dest,
          }))}
        />
      </div>

      {/* Global Profit Settings */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <Label className="text-xl font-semibold mb-2 text-white">
          Ganancia Global
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="globalProfitRT" className="text-white">
              Ganancia R/T ($)
            </Label>
            <Input
              id="globalProfitRT"
              type="number"
              value={globalProfit.rt}
              onChange={(e) =>
                onGlobalProfitChange({
                  ...globalProfit,
                  rt: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1 bg-gray-600 text-white"
              min="0"
              step="1"
            />
          </div>
          <div>
            <Label htmlFor="globalProfitOW" className="text-white">
              Ganancia O/W ($)
            </Label>
            <Input
              id="globalProfitOW"
              type="number"
              value={globalProfit.ow}
              onChange={(e) =>
                onGlobalProfitChange({
                  ...globalProfit,
                  ow: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1 bg-gray-600 text-white"
              min="0"
              step="1"
            />
          </div>
        </div>
      </div>

      {/* Charter Selector - Only show if destination is selected */}
      {selectedDestination && availableCharters.length > 0 && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <Label
            htmlFor="charterSelect"
            className="text-xl font-semibold mb-2 text-white"
          >
            Charters disponibles para {selectedDestination}
          </Label>
          <Select
            id="charterSelect"
            value={selectedCharterIndex.toString()}
            onChange={(e) => onSelectCharter(Number(e.target.value))}
            className="bg-gray-600 text-white"
            options={[
              { value: '-1', label: 'Seleccionar charter...' },
              ...(availableCharters?.map((charter) => ({
                value: charters.indexOf(charter).toString(),
                label: charter.name || 'Charter sin nombre',
              })) || []),
            ]}
          />
        </div>
      )}

      {/* Image Upload Section */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <Label className="text-xl font-semibold mb-4 text-white">
          Logos e Imágenes
        </Label>
        <div className="space-y-4">
          {/* Agency Logo Upload */}
          <div>
            <Label htmlFor="agencyLogoUpload" className="text-white">
              Logo de la Agencia
            </Label>
            <Input
              id="agencyLogoUpload"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, onAgencyLogoChange)}
              ref={agencyLogoInputRef}
              className="hidden"
            />
            <Button
              onClick={() => agencyLogoInputRef.current?.click()}
              variant="outline"
              className="w-full mt-2 flex items-center justify-center text-white bg-gray-600 hover:bg-gray-500"
            >
              <FaUpload className="mr-2" />
              Subir Logo
            </Button>
          </div>

          {/* Promotional Image Upload */}
          <div>
            <Label htmlFor="promotionalImageUpload" className="text-white">
              Imagen Promocional
            </Label>
            <Input
              id="promotionalImageUpload"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, onPromotionalImageChange)}
              ref={promotionalImageInputRef}
              className="hidden"
            />
            <Button
              onClick={() => promotionalImageInputRef.current?.click()}
              variant="outline"
              className="w-full mt-2 flex items-center justify-center text-white bg-gray-600 hover:bg-gray-500"
            >
              <FaUpload className="mr-2" />
              Subir Imagen Promocional
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
        >
          <FaDownload className="mr-2" />
          Descargar
        </Button>
        <Button
          onClick={onSave}
          className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white"
        >
          <FaSave className="mr-2" />
          Guardar
        </Button>
        <Button
          onClick={onLoad}
          className="flex-1 flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white"
        >
          <FaUpload className="mr-2 transform rotate-180" />
          Cargar
        </Button>
      </div>

      {/* Editors - Only show if both destination and charter are selected */}
      {currentDestinationData && selectedCharterIndex >= 0 && (
        <>
          <PriceEditor
            destinationData={currentDestinationData}
            globalProfit={globalProfit}
            onDestinationUpdate={handleDestinationUpdate}
          />
        </>
      )}
    </div>
  )
}

export default EditorToolbar
