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
import { fileOperations } from '../../utils/fileOperations'

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
      console.error('File size exceeds 5MB limit')
      return
    }

    // Read file as base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      callback(result)
    }
    reader.readAsDataURL(file)
  }

  // Handle charter data import
  const handleCharterImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!fileOperations.validateFileFormat(file)) {
      console.error('Invalid file format')
      return
    }

    const result = await fileOperations.importFromFile(file)
    if (result.success && result.data) {
      onCharterUpdate(result.data)
    } else {
      console.error('Failed to import charter data:', result.error)
    }
  }

  // Handle charter data export
  const handleExportPDF = async () => {
    const result = await fileOperations.exportToPDF(charters)
    if (!result.success) {
      console.error('Failed to export PDF:', result.error)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {/* Save Button */}
          <Button onClick={onSave} className="flex items-center gap-2">
            <FaSave /> Save
          </Button>

          {/* Load Button */}
          <Button onClick={onLoad} className="flex items-center gap-2">
            <FaUpload /> Load
          </Button>

          {/* Export Button */}
          <Button onClick={handleExportPDF} className="flex items-center gap-2">
            <FaDownload /> Export PDF
          </Button>

          {/* Import Button */}
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleCharterImport}
              className="hidden"
              id="charter-import"
            />
            <Button
              onClick={() => document.getElementById('charter-import')?.click()}
              className="flex items-center gap-2"
            >
              <FaUpload /> Import JSON
            </Button>
          </div>
        </div>

        {/* Global Profit Controls */}
        <div className="flex gap-4 items-center">
          <Label>Round Trip Profit:</Label>
          <Input
            type="number"
            value={globalProfit.rt}
            onChange={(e) =>
              onGlobalProfitChange({
                ...globalProfit,
                rt: Number(e.target.value),
              })
            }
            className="w-24"
          />

          <Label>One Way Profit:</Label>
          <Input
            type="number"
            value={globalProfit.ow}
            onChange={(e) =>
              onGlobalProfitChange({
                ...globalProfit,
                ow: Number(e.target.value),
              })
            }
            className="w-24"
          />
        </div>
      </div>

      {/* Destination and Charter Selection */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label>Destination:</Label>
          <Select
            value={selectedDestination}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="bg-gray-600 text-white"
            options={allDestinations.map((dest) => ({
              value: dest,
              label: dest,
            }))}
          />
        </div>

        <div className="flex-1">
          <Label>Charter:</Label>
          <Select
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
      </div>

      {/* Agency Logo Upload */}
      <div className="flex gap-4">
        <div>
          <Label>Agency Logo:</Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, onAgencyLogoChange)}
            ref={agencyLogoInputRef}
            className="hidden"
          />
          <Button
            onClick={() => agencyLogoInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <FaUpload /> Upload Logo
          </Button>
        </div>

        {/* Promotional Image Upload */}
        <div>
          <Label>Promotional Image:</Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, onPromotionalImageChange)}
            ref={promotionalImageInputRef}
            className="hidden"
          />
          <Button
            onClick={() => promotionalImageInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <FaUpload /> Upload Promo
          </Button>
        </div>
      </div>

      {/* Editors - Only show if both destination and charter are selected */}
      {currentDestinationData && selectedCharterIndex >= 0 && (
        <>
          <PriceEditor
            destinationData={currentDestinationData}
            globalProfit={globalProfit}
            onDestinationUpdate={(updatedDestData) => {
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
            }}
          />
        </>
      )}
    </div>
  )
}

export default EditorToolbar
