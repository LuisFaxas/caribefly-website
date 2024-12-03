// src/components/editors/PriceEditor.tsx

import React, { useState, useEffect } from 'react'
import { CharterData, DestinationData, GlobalProfit } from '@/types/charter'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { Card } from '@/app/components/ui/card'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { TimeSelector } from '@/app/components/ui/time-selector'
import BaggageInfoEditor from './BaggageInfoEditor'
import InfoEditor from './InfoEditor'

interface PriceEditorProps {
  charter: CharterData
  selectedDestination: string
  globalProfit: GlobalProfit
  onUpdate: (updatedCharter: CharterData) => void
  onDestinationUpdate: (updatedDestination: DestinationData) => void
}

const PriceEditor: React.FC<PriceEditorProps> = ({
  charter,
  selectedDestination,
  globalProfit,
  onUpdate,
  onDestinationUpdate,
}) => {
  // Get current destination data
  const destinationData = charter.destinations.find(
    (d) => d.destination === selectedDestination
  )

  // Local state for editing
  const [localData, setLocalData] = useState<DestinationData | null>(null)

  // Update local data when destination changes
  useEffect(() => {
    if (destinationData) {
      setLocalData(destinationData)
    }
  }, [destinationData])

  if (!destinationData || !localData) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <p className="text-gray-400 text-center">
          Select a destination to start editing
        </p>
      </div>
    )
  }

  // Update handlers
  const updateDestination = (updates: Partial<DestinationData>) => {
    const updatedData = { ...localData, ...updates }
    setLocalData(updatedData)
    onDestinationUpdate(updatedData)
  }

  // Flight schedule handlers
  const handleAddFlightTime = () => {
    updateDestination({
      flightTimes: [
        ...localData.flightTimes,
        { ida: '10:00', regreso: '13:00' },
      ],
      flightDays: [...localData.flightDays, 'Monday'],
    })
  }

  const handleRemoveFlightTime = (index: number) => {
    const updatedTimes = localData.flightTimes.filter((_, i) => i !== index)
    const updatedDays = localData.flightDays.filter((_, i) => i !== index)
    updateDestination({
      flightTimes: updatedTimes,
      flightDays: updatedDays,
    })
  }

  const handleFlightTimeChange = (
    index: number,
    type: 'ida' | 'regreso',
    value: string
  ) => {
    const updatedTimes = localData.flightTimes.map((time, i) =>
      i === index ? { ...time, [type]: value } : time
    )
    updateDestination({ flightTimes: updatedTimes })
  }

  // Flight days handlers
  const handleFlightDayChange = (index: number, value: string) => {
    const updatedDays = [...localData.flightDays]
    updatedDays[index] = value
    updateDestination({ flightDays: updatedDays })
  }

  // Period handlers
  const handleAddPeriod = () => {
    const newPeriod = {
      label: 'New Period',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      rt: 299,
      ow: 199,
    }
    updateDestination({
      periods: [...localData.periods, newPeriod],
    })
  }

  const handleRemovePeriod = (index: number) => {
    const updatedPeriods = localData.periods.filter((_, i) => i !== index)
    updateDestination({ periods: updatedPeriods })
  }

  const handlePeriodChange = (
    index: number,
    field: keyof (typeof localData.periods)[0],
    value: string
  ) => {
    const updatedPeriods = localData.periods.map((period, i) =>
      i === index
        ? {
            ...period,
            [field]: field === 'label' ? value : Number(value),
          }
        : period
    )
    updateDestination({ periods: updatedPeriods })
  }

  // Baggage and Additional Info handlers
  const handleBaggageInfoUpdate = (newInfo: string[]) => {
    updateDestination({ baggageInfo: newInfo })
  }

  const handleAdditionalInfoUpdate = (newInfo: string[]) => {
    updateDestination({ additionalInfo: newInfo })
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-8">
      <h2 className="text-xl font-semibold text-gray-200">
        Editing {selectedDestination}
      </h2>

      {/* Flight Schedule Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold text-gray-200">
            Flight Schedule
          </Label>
          <Button
            onClick={handleAddFlightTime}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <FaPlus className="w-4 h-4" />
            Add Schedule
          </Button>
        </div>

        <div className="space-y-4">
          {localData.flightTimes.map((time, index) => (
            <Card key={index} className="bg-gray-700 border-gray-600">
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-200">Schedule {index + 1}</Label>
                  <Button
                    onClick={() => handleRemoveFlightTime(index)}
                    variant="destructive"
                    className="p-1 bg-red-600 hover:bg-red-700"
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Flight Days</Label>
                    <Input
                      value={localData.flightDays[index] || ''}
                      onChange={(e) =>
                        handleFlightDayChange(index, e.target.value)
                      }
                      placeholder="e.g., Monday and Thursday"
                      className="bg-gray-800 border-gray-600 text-gray-200"
                    />
                  </div>

                  <TimeSelector
                    idaValue={time.ida}
                    regresoValue={time.regreso}
                    onIdaChange={(value) =>
                      handleFlightTimeChange(index, 'ida', value)
                    }
                    onRegresoChange={(value) =>
                      handleFlightTimeChange(index, 'regreso', value)
                    }
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Price Periods Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold text-gray-200">
            Price Periods
          </Label>
          <Button
            onClick={handleAddPeriod}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <FaPlus className="w-4 h-4" />
            Add Period
          </Button>
        </div>

        <div className="space-y-4">
          {localData.periods.map((period, index) => (
            <Card key={index} className="bg-gray-700 border-gray-600">
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Input
                    value={period.label}
                    onChange={(e) =>
                      handlePeriodChange(index, 'label', e.target.value)
                    }
                    placeholder="Period Name"
                    className="bg-gray-800 border-gray-600 text-gray-200 w-64"
                  />
                  <Button
                    onClick={() => handleRemovePeriod(index)}
                    variant="destructive"
                    className="p-1 bg-red-600 hover:bg-red-700"
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Start Date</Label>
                    <Input
                      type="date"
                      value={period.startDate}
                      onChange={(e) =>
                        handlePeriodChange(index, 'startDate', e.target.value)
                      }
                      className="bg-gray-800 border-gray-600 text-gray-200"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">End Date</Label>
                    <Input
                      type="date"
                      value={period.endDate}
                      onChange={(e) =>
                        handlePeriodChange(index, 'endDate', e.target.value)
                      }
                      className="bg-gray-800 border-gray-600 text-gray-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Round Trip Price</Label>
                    <Input
                      type="number"
                      value={period.rt}
                      onChange={(e) =>
                        handlePeriodChange(index, 'rt', e.target.value)
                      }
                      className="bg-gray-800 border-gray-600 text-gray-200"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">One Way Price</Label>
                    <Input
                      type="number"
                      value={period.ow}
                      onChange={(e) =>
                        handlePeriodChange(index, 'ow', e.target.value)
                      }
                      className="bg-gray-800 border-gray-600 text-gray-200"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Baggage Info Section */}
      <section className="space-y-4">
        <Label className="text-lg font-semibold text-gray-200">
          Baggage Information
        </Label>
        <BaggageInfoEditor
          info={localData.baggageInfo}
          onUpdate={handleBaggageInfoUpdate}
        />
      </section>

      {/* Additional Info Section */}
      <section className="space-y-4">
        <Label className="text-lg font-semibold text-gray-200">
          Additional Information
        </Label>
        <InfoEditor
          info={localData.additionalInfo}
          onUpdate={handleAdditionalInfoUpdate}
        />
      </section>
    </div>
  )
}

export default PriceEditor
