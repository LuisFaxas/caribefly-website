// src/components/editors/PriceEditor.tsx

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import TimeSelector from '../ui/TimeSelector'
import type { DestinationData, GlobalProfit } from '@/types'
import { FaTrash, FaPlus } from 'react-icons/fa'
import BaggageInfoEditor from './BaggageInfoEditor'
import InfoEditor from './InfoEditor'

interface PriceEditorProps {
  destinationData: DestinationData
  globalProfit: GlobalProfit
  onDestinationUpdate: (updatedData: DestinationData) => void
}

const PriceEditor: React.FC<PriceEditorProps> = ({
  destinationData,
  globalProfit,
  onDestinationUpdate,
}) => {
  // Create a local copy for editing
  const [localData, setLocalData] = useState<DestinationData>(destinationData)

  // Reset localData when destinationData changes
  useEffect(() => {
    setLocalData(destinationData)
  }, [destinationData])

  // Apply updates and notify parent
  const applyUpdates = (updatedData: DestinationData) => {
    setLocalData(updatedData)
    onDestinationUpdate(updatedData)
  }

  // Flight Schedule Handlers
  const handleFlightDayChange = (dayIndex: number, value: string) => {
    const updatedData = { ...localData }
    updatedData.flightDays = [...updatedData.flightDays]
    updatedData.flightDays[dayIndex] = value
    applyUpdates(updatedData)
  }

  const handleAddFlightTime = () => {
    const updatedData = { ...localData }
    updatedData.flightTimes = [
      ...updatedData.flightTimes,
      { ida: '00:00', regreso: '00:00' },
    ]
    updatedData.flightDays = [...updatedData.flightDays, '']
    applyUpdates(updatedData)
  }

  const handleRemoveFlightTime = (index: number) => {
    const updatedData = { ...localData }
    updatedData.flightTimes = updatedData.flightTimes.filter(
      (_, i) => i !== index
    )
    updatedData.flightDays = updatedData.flightDays.filter(
      (_, i) => i !== index
    )
    applyUpdates(updatedData)
  }

  // Price Period Handlers
  const handleAddPeriod = () => {
    const updatedData = { ...localData }
    updatedData.periods = [
      ...updatedData.periods,
      {
        label: 'Nuevo Periodo',
        rt: undefined,
        ow: undefined,
        profitOverride: {},
      },
    ]
    applyUpdates(updatedData)
  }

  const handleRemovePeriod = (index: number) => {
    const updatedData = { ...localData }
    updatedData.periods = updatedData.periods.filter((_, i) => i !== index)
    applyUpdates(updatedData)
  }

  const handlePeriodChange = (
    periodIndex: number,
    field: 'label' | 'rt' | 'ow',
    value: string
  ) => {
    const updatedData = { ...localData }
    updatedData.periods = updatedData.periods.map((period, idx) =>
      idx === periodIndex
        ? {
            ...period,
            [field]: field === 'label' ? value : parseFloat(value) || undefined,
          }
        : period
    )
    applyUpdates(updatedData)
  }

  const handleProfitOverrideChange = (
    periodIndex: number,
    field: 'rt' | 'ow',
    value: string
  ) => {
    const updatedData = { ...localData }
    updatedData.periods = updatedData.periods.map((period, idx) => {
      if (idx === periodIndex) {
        const profitOverride = {
          ...period.profitOverride,
          [field]: parseFloat(value) || undefined,
        }
        return { ...period, profitOverride }
      }
      return period
    })
    applyUpdates(updatedData)
  }

  // Baggage Info Update Handler
  const handleBaggageInfoUpdate = (newInfo: string[]) => {
    const updatedData = { ...localData, baggageInfo: newInfo }
    applyUpdates(updatedData)
  }

  // Additional Info Update Handler
  const handleAdditionalInfoUpdate = (newInfo: string[]) => {
    const updatedData = { ...localData, additionalInfo: newInfo }
    applyUpdates(updatedData)
  }

  // Flight Time Handlers
  const handleFlightTimeChange = (
    index: number,
    type: 'ida' | 'regreso',
    newTime: string
  ) => {
    const updatedData = { ...localData }
    updatedData.flightTimes = updatedData.flightTimes.map((time, idx) =>
      idx === index ? { ...time, [type]: newTime } : time
    )
    applyUpdates(updatedData)
  }

  return (
    <div className="bg-gray-700 p-4 rounded-lg space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Editor de {destinationData.destination}
      </h2>

      {/* Flight Schedule Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold text-white">
            Horarios de Vuelo
          </Label>
          <Button
            onClick={handleAddFlightTime}
            variant="outline"
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <FaPlus className="mr-2" />
            Agregar Horario
          </Button>
        </div>

        {localData.flightTimes.map((time, index) => (
          <Card key={index} className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-md font-medium text-white">
                  Horario {index + 1}
                </Label>
                <Button
                  onClick={() => handleRemoveFlightTime(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <FaTrash className="mr-2" />
                  Eliminar
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Día de Vuelo</Label>
                  <Input
                    value={localData.flightDays[index] || ''}
                    onChange={(e) =>
                      handleFlightDayChange(index, e.target.value)
                    }
                    placeholder="Ej: Lunes y Jueves"
                    className="mt-1 bg-gray-700 text-white border-gray-600"
                  />
                </div>

                <TimeSelector
                  label="Horarios"
                  idaValue={time.ida}
                  regresoValue={time.regreso}
                  onIdaChange={(newTime) =>
                    handleFlightTimeChange(index, 'ida', newTime)
                  }
                  onRegresoChange={(newTime) =>
                    handleFlightTimeChange(index, 'regreso', newTime)
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Price Periods Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold text-white">
            Periodos de Precios
          </Label>
          <Button
            onClick={handleAddPeriod}
            variant="outline"
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <FaPlus className="mr-2" />
            Agregar Periodo
          </Button>
        </div>

        {localData.periods.map((period, index) => (
          <Card key={index} className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <Input
                  value={period.label}
                  onChange={(e) =>
                    handlePeriodChange(index, 'label', e.target.value)
                  }
                  placeholder="Nombre del Periodo"
                  className="flex-grow mr-2 bg-gray-700 text-white border-gray-600"
                />
                <Button
                  onClick={() => handleRemovePeriod(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <FaTrash className="mr-2" />
                  Eliminar
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Base Prices */}
                <div className="space-y-2">
                  <Label className="text-white">Precio Base R/T</Label>
                  <Input
                    type="number"
                    value={period.rt ?? ''}
                    onChange={(e) =>
                      handlePeriodChange(index, 'rt', e.target.value)
                    }
                    placeholder="Precio R/T"
                    className="bg-gray-700 text-white border-gray-600"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Precio Base O/W</Label>
                  <Input
                    type="number"
                    value={period.ow ?? ''}
                    onChange={(e) =>
                      handlePeriodChange(index, 'ow', e.target.value)
                    }
                    placeholder="Precio O/W"
                    className="bg-gray-700 text-white border-gray-600"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Profit Overrides */}
                <div className="space-y-2">
                  <Label className="text-white">Ganancia R/T (Override)</Label>
                  <Input
                    type="number"
                    value={period.profitOverride?.rt ?? ''}
                    onChange={(e) =>
                      handleProfitOverrideChange(index, 'rt', e.target.value)
                    }
                    placeholder={`Global: +$${globalProfit.rt}`}
                    className="bg-gray-700 text-white border-gray-600"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Ganancia O/W (Override)</Label>
                  <Input
                    type="number"
                    value={period.profitOverride?.ow ?? ''}
                    onChange={(e) =>
                      handleProfitOverrideChange(index, 'ow', e.target.value)
                    }
                    placeholder={`Global: +$${globalProfit.ow}`}
                    className="bg-gray-700 text-white border-gray-600"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Baggage Information Section */}
      <BaggageInfoEditor
        destinationData={localData}
        onBaggageInfoUpdate={handleBaggageInfoUpdate}
      />

      {/* Additional Information Section */}
      <InfoEditor
        destinationData={localData}
        onInfoUpdate={handleAdditionalInfoUpdate}
      />
    </div>
  )
}

export default PriceEditor
