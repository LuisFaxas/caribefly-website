// src/components/controls/ChartControls.tsx
import React, { ChangeEvent } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent } from '../ui/card'
import { GlobalProfit } from '../../types'
import { FaSave, FaDownload } from 'react-icons/fa'

interface ChartControlsProps {
  onDownload: () => void
  onSave: () => void
  onLoad: () => void
  globalProfit: GlobalProfit
  onGlobalProfitChange: (profit: GlobalProfit) => void
}

const ChartControls: React.FC<ChartControlsProps> = ({
  onDownload,
  onSave,
  onLoad,
  globalProfit,
  onGlobalProfitChange,
}) => {
  const handleProfitChange = (type: keyof GlobalProfit, value: string) => {
    onGlobalProfitChange({
      ...globalProfit,
      [type]: parseFloat(value) || 0,
    })
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        {/* Added Section Header */}
        <h2 className="text-xl font-bold mb-4">Controles Generales</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="globalProfitRT">Ganancia R/T ($)</Label>
            <Input
              id="globalProfitRT"
              type="number"
              value={globalProfit.rt}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleProfitChange('rt', e.target.value)
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="globalProfitOW">Ganancia O/W ($)</Label>
            <Input
              id="globalProfitOW"
              type="number"
              value={globalProfit.ow}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleProfitChange('ow', e.target.value)
              }
              className="mt-1"
            />
          </div>
        </div>

        {/* Updated Buttons with Icons and Labels */}
        <div className="flex gap-2">
          <Button onClick={onSave} className="flex items-center gap-2">
            <FaSave /> Guardar
          </Button>
          <Button
            onClick={onLoad}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FaDownload /> Cargar
          </Button>
          <Button
            onClick={onDownload}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <FaDownload /> Descargar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChartControls
