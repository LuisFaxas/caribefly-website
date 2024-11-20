'use client'

import React from 'react'
import { Button, Input, Label, Select } from '@/app/admin/components/ui'
import type { CharterData, GlobalProfit } from '@/types/charter'

interface EditorToolbarProps {
  charters: CharterData[]
  selectedDestination: string
  selectedCharterIndex: number
  globalProfit: GlobalProfit
  onDestinationChange: (destination: string) => void
  onCharterSelect: (index: number) => void
  onGlobalProfitChange: (profit: GlobalProfit) => void
  onSave: () => void
  onExport: () => void
  onImageUpload: (type: 'logo' | 'promo', file: File) => void
}

const EditorToolbar = ({
  charters,
  selectedDestination,
  selectedCharterIndex,
  globalProfit,
  onDestinationChange,
  onCharterSelect,
  onGlobalProfitChange,
  onSave,
  onExport,
  onImageUpload,
}: EditorToolbarProps) => {
  // Get all unique destinations across all charters
  const allDestinations = Array.from(
    new Set(
      charters.flatMap((charter) =>
        charter.destinations.map((dest) => dest.destination)
      )
    )
  ).sort()

  // Get all charter names
  const charterNames = charters.map((charter, index) => ({
    label: charter.name,
    value: index.toString(),
  }))

  const handleFileUpload =
    (type: 'logo' | 'promo') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB')
        return
      }

      onImageUpload(type, file)
    }

  return (
    <div className="space-y-6 p-4 bg-gray-800 rounded-lg">
      <div className="space-y-4">
        <div>
          <Label>Destination</Label>
          <Select
            value={selectedDestination}
            onChange={(value) => onDestinationChange(value)}
            options={allDestinations.map((dest) => ({
              label: dest,
              value: dest,
            }))}
          />
        </div>

        <div>
          <Label>Charter</Label>
          <Select
            value={selectedCharterIndex.toString()}
            onChange={(value) => onCharterSelect(parseInt(value, 10))}
            options={charterNames}
          />
        </div>

        <div className="space-y-2">
          <Label>Global Profit</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Round Trip</Label>
              <Input
                type="number"
                value={globalProfit.rt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onGlobalProfitChange({
                    ...globalProfit,
                    rt: parseInt(e.target.value) || 0,
                  })
                }
                min={0}
              />
            </div>
            <div>
              <Label>One Way</Label>
              <Input
                type="number"
                value={globalProfit.ow}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onGlobalProfitChange({
                    ...globalProfit,
                    ow: parseInt(e.target.value) || 0,
                  })
                }
                min={0}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Images</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload('logo')}
                className="hidden"
                id="logo-upload"
              />
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <Button as="span" variant="secondary" className="w-full">
                  Upload Logo
                </Button>
              </Label>
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload('promo')}
                className="hidden"
                id="promo-upload"
              />
              <Label htmlFor="promo-upload" className="cursor-pointer">
                <Button as="span" variant="secondary" className="w-full">
                  Upload Promo
                </Button>
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={onSave} variant="primary">
            Save Changes
          </Button>
          <Button onClick={onExport} variant="secondary">
            Export Image
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditorToolbar
