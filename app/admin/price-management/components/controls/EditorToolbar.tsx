// src/components/controls/EditorToolbar.tsx

import React, { useRef, useMemo } from 'react'
import { Button, Input, Label, Select } from '@/app/components/ui'
import type {
  CharterData,
  GlobalProfit,
  DestinationData,
} from '@/types/charter'
import { FaSave, FaDownload, FaUpload } from 'react-icons/fa'
import toast from 'react-hot-toast'

interface EditorToolbarProps {
  charters: CharterData[]
  globalProfit: GlobalProfit
  onCharterUpdate: (charters: CharterData[]) => void
  onGlobalProfitChange: (profit: GlobalProfit) => void
  onDownload: () => void
  onSave: () => void
  onLoad: (event: React.ChangeEvent<HTMLInputElement>) => void
  onAgencyLogoChange: (logo: string) => void
  onPromotionalImageChange: (image: string) => void
  selectedDestination: string
  onDestinationChange: (destination: string) => void
  selectedCharterIndex: number
  onSelectCharter: (index: number) => void
  agencyLogo?: string
  promotionalImage?: string
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
  agencyLogo,
  promotionalImage,
}) => {
  const agencyLogoInputRef = useRef<HTMLInputElement>(null)
  const promotionalImageInputRef = useRef<HTMLInputElement>(null)

  // Generate destination options
  const destinationOptions = useMemo(() => {
    if (!charters || selectedCharterIndex < 0) {
      return []
    }

    const charter = charters[selectedCharterIndex]
    if (!charter?.destinations) {
      return []
    }

    return charter.destinations.map((dest) => ({
      value: dest.destination,
      label: dest.destination,
    }))
  }, [charters, selectedCharterIndex])

  // Generate charter options
  const charterOptions = useMemo(() => {
    if (!charters || charters.length === 0) {
      console.log('[EditorToolbar] No charters available')
      return []
    }

    return charters.map((charter, index) => ({
      value: index.toString(),
      label: charter.name || `Charter ${index + 1}`,
    }))
  }, [charters])

  // Handle charter selection
  const handleCharterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(event.target.value)
    if (!isNaN(index)) {
      onSelectCharter(index)

      // Reset destination selection when charter changes
      if (charters[index]?.destinations?.length > 0) {
        onDestinationChange(charters[index].destinations[0].destination)
      }
    }
  }

  // Handle file selection for agency logo
  const handleAgencyLogoSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          onAgencyLogoChange(base64String)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('[EditorToolbar] Error reading agency logo:', error)
        toast.error('Error uploading agency logo')
      }
    }
  }

  // Handle file selection for promotional image
  const handlePromotionalImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          onPromotionalImageChange(base64String)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('[EditorToolbar] Error reading promotional image:', error)
        toast.error('Error uploading promotional image')
      }
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-6">
      {/* Charter Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200">
          Charter Selection
        </h3>

        {/* Charter Dropdown */}
        <div>
          <Label className="text-gray-300">Charter</Label>
          <Select
            value={selectedCharterIndex.toString()}
            onChange={handleCharterChange}
            options={charterOptions}
            className="w-full bg-gray-700 border-gray-600 text-gray-200"
          />
        </div>

        {/* Destination Dropdown */}
        <div>
          <Label className="text-gray-300">Destination</Label>
          <Select
            value={selectedDestination}
            onChange={(e) => onDestinationChange(e.target.value)}
            options={destinationOptions}
            className="w-full bg-gray-700 border-gray-600 text-gray-200"
          />
        </div>

        {/* Global Profit Controls */}
        <div className="space-y-2">
          <Label className="text-gray-300">Global Profit</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Round Trip ($)</Label>
              <Input
                type="number"
                value={globalProfit.rt}
                onChange={(e) =>
                  onGlobalProfitChange({
                    ...globalProfit,
                    rt: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                className="w-full bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
            <div>
              <Label className="text-gray-300">One Way ($)</Label>
              <Input
                type="number"
                value={globalProfit.ow}
                onChange={(e) =>
                  onGlobalProfitChange({
                    ...globalProfit,
                    ow: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                className="w-full bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <FaSave className="w-4 h-4" />
          <span>Save</span>
        </Button>

        <Button
          onClick={onDownload}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <FaDownload className="w-4 h-4" />
          <span>Export</span>
        </Button>

        <div className="relative">
          <Button
            onClick={() => agencyLogoInputRef.current?.click()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <FaUpload className="w-4 h-4" />
            <span>Logo</span>
          </Button>
          <input
            ref={agencyLogoInputRef}
            type="file"
            accept="image/*"
            onChange={handleAgencyLogoSelect}
            className="hidden"
          />
        </div>

        <div className="relative">
          <Button
            onClick={() => promotionalImageInputRef.current?.click()}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700"
          >
            <FaUpload className="w-4 h-4" />
            <span>Promo</span>
          </Button>
          <input
            ref={promotionalImageInputRef}
            type="file"
            accept="image/*"
            onChange={handlePromotionalImageSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-900 rounded text-xs text-gray-400">
          <pre>
            {JSON.stringify(
              {
                selectedDestination,
                selectedCharterIndex,
                charterName: charters[selectedCharterIndex]?.name,
                destinationsCount: destinationOptions.length,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  )
}

export default EditorToolbar
