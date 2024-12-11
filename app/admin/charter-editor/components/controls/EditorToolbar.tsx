// src/components/controls/EditorToolbar.tsx

import React, { useRef, useMemo, ChangeEvent } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import Select from '../ui/select'
import PriceEditor from '../editors/PriceEditor'
import type { CharterData, GlobalProfit, DestinationData } from '../../types'
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
    const destinations = new Set<string>()
    charters.forEach((charter) => {
      charter.destinations.forEach((dest) => {
        destinations.add(dest.destination)
      })
    })
    return Array.from(destinations)
  }, [charters])

  // Get the current destination data
  const currentDestination = useMemo(() => {
    if (selectedCharterIndex === -1) return null
    const charter = charters[selectedCharterIndex]
    return charter?.destinations.find(
      (dest) => dest.destination === selectedDestination
    )
  }, [charters, selectedCharterIndex, selectedDestination])

  const handleDestinationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onDestinationChange(e.target.value)
  }

  const handleCharterSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    onSelectCharter(parseInt(e.target.value))
  }

  const handleAgencyLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onAgencyLogoChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePromotionalImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onPromotionalImageChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDestinationDataUpdate = (updatedData: DestinationData) => {
    if (selectedCharterIndex === -1) return

    const updatedCharters = [...charters]
    const charter = { ...updatedCharters[selectedCharterIndex] }
    const destIndex = charter.destinations.findIndex(
      (dest) => dest.destination === selectedDestination
    )

    if (destIndex !== -1) {
      charter.destinations = [...charter.destinations]
      charter.destinations[destIndex] = updatedData
      updatedCharters[selectedCharterIndex] = charter
      onCharterUpdate(updatedCharters)
    }
  }

  return (
    <div className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-md text-white">
      {/* Destination Selector - First */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <Label
          htmlFor="destinationSelect"
          className="text-xl font-semibold mb-2 text-white"
        >
          Seleccionar Destino
        </Label>
        <Select
          id="destinationSelect"
          value={selectedDestination}
          onChange={handleDestinationChange}
          className="bg-gray-600 text-white"
        >
          <option value="">Seleccionar destino...</option>
          {allDestinations.map((destination) => (
            <option key={destination} value={destination}>
              {destination}
            </option>
          ))}
        </Select>
      </div>

      {/* Charter Selector - Only show if destination is selected */}
      {selectedDestination && charters.length > 0 && (
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
            onChange={handleCharterSelect}
            className="bg-gray-600 text-white"
          >
            <option value="-1">Seleccionar charter...</option>
            {charters.map((charter, index) => (
              <option key={index} value={index}>
                {charter.name}
              </option>
            ))}
          </Select>
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
              onChange={handleAgencyLogoUpload}
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
              onChange={handlePromotionalImageUpload}
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
        <Button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
        >
          <FaDownload className="mr-2" />
          Descargar
        </Button>
      </div>

      {/* Editors - Only show if both destination and charter are selected */}
      {currentDestination && selectedCharterIndex >= 0 && (
        <>
          <PriceEditor
            destinationData={currentDestination}
            globalProfit={globalProfit}
            onDestinationUpdate={handleDestinationDataUpdate}
          />
        </>
      )}
    </div>
  )
}

export default EditorToolbar
