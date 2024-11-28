// src/components/editors/PriceEditor.tsx

import React, { useState, useEffect } from 'react'
import { Card, CardContent, Input, Label, Button } from '@/app/components/ui'
import TimeSelector from '../ui/TimeSelector'
import type { CharterData, GlobalProfit, Period } from '@/types/charter'
import { FaTrash, FaPlus } from 'react-icons/fa'
import BaggageInfoEditor from './BaggageInfoEditor'
import InfoEditor from './InfoEditor'
import {
  validateDestination,
  validateCharterData,
  ValidationError,
} from '../../utils/validation'
import ErrorBoundary from '../ErrorBoundary'

interface PriceEditorProps {
  charters: CharterData[]
  selectedDestination: string
  selectedCharterIndex: number
  globalProfit: GlobalProfit
  onCharterUpdate?: (updatedCharters: CharterData[]) => void
}

const PriceEditor: React.FC<PriceEditorProps> = ({
  charters,
  selectedDestination,
  selectedCharterIndex,
  globalProfit,
  onCharterUpdate,
}) => {
  // Local state
  const [localData, setLocalData] = useState<CharterData | null>(null)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isEditing, setIsEditing] = useState(false)

  // Reset localData when selected charter changes
  useEffect(() => {
    if (selectedCharterIndex >= 0 && charters?.[selectedCharterIndex]) {
      setLocalData(charters[selectedCharterIndex])
      setErrors([])
      setIsEditing(false)
    } else {
      setLocalData(null)
      setErrors([])
    }
  }, [charters, selectedCharterIndex])

  // Get the current destination data
  const destinationData = localData?.destinations?.find(
    (dest) => dest.destination === selectedDestination
  )

  // Update parent component with changes
  const updateParent = (updatedData: CharterData) => {
    if (!onCharterUpdate) return

    const updatedCharters = [...charters]
    updatedCharters[selectedCharterIndex] = updatedData
    onCharterUpdate(updatedCharters)
  }

  // Handle period changes
  const handlePeriodChange = (
    periodIndex: number,
    field: keyof Period,
    value: any
  ) => {
    if (!localData || !destinationData) return

    const updatedData = { ...localData }
    const destIndex = updatedData.destinations.findIndex(
      (d) => d.destination === selectedDestination
    )

    if (destIndex === -1) return

    const periods = [...updatedData.destinations[destIndex].periods]
    periods[periodIndex] = {
      ...periods[periodIndex],
      [field]: value,
    }

    updatedData.destinations[destIndex].periods = periods

    // Validate the updated data
    const validationErrors = validateDestination(
      updatedData.destinations[destIndex]
    )
    setErrors(validationErrors)

    setLocalData(updatedData)
    if (validationErrors.length === 0) {
      updateParent(updatedData)
    }
  }

  // Add new period
  const handleAddPeriod = () => {
    if (!localData || !destinationData) return

    const updatedData = { ...localData }
    const destIndex = updatedData.destinations.findIndex(
      (d) => d.destination === selectedDestination
    )

    if (destIndex === -1) return

    const newPeriod: Period = {
      rt: 0,
      ow: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    }

    updatedData.destinations[destIndex].periods = [
      ...updatedData.destinations[destIndex].periods,
      newPeriod,
    ]

    setLocalData(updatedData)
    updateParent(updatedData)
  }

  // Remove period
  const handleRemovePeriod = (periodIndex: number) => {
    if (!localData || !destinationData) return

    const updatedData = { ...localData }
    const destIndex = updatedData.destinations.findIndex(
      (d) => d.destination === selectedDestination
    )

    if (destIndex === -1) return

    updatedData.destinations[destIndex].periods = updatedData.destinations[
      destIndex
    ].periods.filter((_, index) => index !== periodIndex)

    setLocalData(updatedData)
    updateParent(updatedData)
  }

  if (!localData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Select a charter to edit its details
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Charter Info */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Charter Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="charterName">Charter Name</Label>
                <Input
                  id="charterName"
                  value={localData.name}
                  onChange={(e) => {
                    const updatedData = { ...localData, name: e.target.value }
                    setLocalData(updatedData)
                    updateParent(updatedData)
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destination Info */}
        {destinationData && (
          <>
            {/* Flight Schedule */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Flight Schedule</h3>
                <TimeSelector
                  days={destinationData.flightDays}
                  times={destinationData.flightTimes}
                  onUpdate={(days, times) => {
                    const updatedData = { ...localData }
                    const destIndex = updatedData.destinations.findIndex(
                      (d) => d.destination === selectedDestination
                    )
                    if (destIndex !== -1) {
                      updatedData.destinations[destIndex].flightDays = days
                      updatedData.destinations[destIndex].flightTimes = times
                      setLocalData(updatedData)
                      updateParent(updatedData)
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Periods */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Price Periods</h3>
                  <Button
                    variant="secondary"
                    onClick={handleAddPeriod}
                    className="flex items-center gap-2"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add Period
                  </Button>
                </div>

                <div className="space-y-4">
                  {destinationData.periods.map((period, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-4 relative"
                    >
                      <button
                        onClick={() => handleRemovePeriod(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`period-${index}-start`}>
                            Start Date
                          </Label>
                          <Input
                            type="date"
                            id={`period-${index}-start`}
                            value={period.startDate}
                            onChange={(e) =>
                              handlePeriodChange(
                                index,
                                'startDate',
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`period-${index}-end`}>
                            End Date
                          </Label>
                          <Input
                            type="date"
                            id={`period-${index}-end`}
                            value={period.endDate}
                            onChange={(e) =>
                              handlePeriodChange(
                                index,
                                'endDate',
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`period-${index}-rt`}>
                            Round Trip Price
                          </Label>
                          <Input
                            type="number"
                            id={`period-${index}-rt`}
                            value={period.rt}
                            onChange={(e) =>
                              handlePeriodChange(
                                index,
                                'rt',
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`period-${index}-ow`}>
                            One Way Price
                          </Label>
                          <Input
                            type="number"
                            id={`period-${index}-ow`}
                            value={period.ow}
                            onChange={(e) =>
                              handlePeriodChange(
                                index,
                                'ow',
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* Profit Override */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`period-${index}-profit-rt`}>
                            RT Profit Override (Optional)
                          </Label>
                          <Input
                            type="number"
                            id={`period-${index}-profit-rt`}
                            value={period.profitOverride?.rt ?? ''}
                            placeholder={`Default: ${globalProfit.rt}%`}
                            onChange={(e) =>
                              handlePeriodChange(index, 'profitOverride', {
                                ...period.profitOverride,
                                rt: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`period-${index}-profit-ow`}>
                            OW Profit Override (Optional)
                          </Label>
                          <Input
                            type="number"
                            id={`period-${index}-profit-ow`}
                            value={period.profitOverride?.ow ?? ''}
                            placeholder={`Default: ${globalProfit.ow}%`}
                            onChange={(e) =>
                              handlePeriodChange(index, 'profitOverride', {
                                ...period.profitOverride,
                                ow: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Additional Information
                </h3>
                <div className="space-y-6">
                  <BaggageInfoEditor
                    info={destinationData.baggageInfo}
                    onUpdate={(info) => {
                      const updatedData = { ...localData }
                      const destIndex = updatedData.destinations.findIndex(
                        (d) => d.destination === selectedDestination
                      )
                      if (destIndex !== -1) {
                        updatedData.destinations[destIndex].baggageInfo = info
                        setLocalData(updatedData)
                        updateParent(updatedData)
                      }
                    }}
                  />
                  <InfoEditor
                    info={destinationData.additionalInfo}
                    label="Additional Info"
                    onUpdate={(info) => {
                      const updatedData = { ...localData }
                      const destIndex = updatedData.destinations.findIndex(
                        (d) => d.destination === selectedDestination
                      )
                      if (destIndex !== -1) {
                        updatedData.destinations[destIndex].additionalInfo =
                          info
                        setLocalData(updatedData)
                        updateParent(updatedData)
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Validation Errors */}
        {errors.length > 0 && (
          <Card className="border-destructive">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Validation Errors
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-destructive">
                    {error.message}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default PriceEditor
