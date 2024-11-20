// app/admin/charter-editor/components/controls/ChartControls.tsx
import React from 'react'
import { Button, Input, Label } from '@/app/admin/components/ui'
import { Card, CardContent } from '@/app/admin/components/ui/card'
import { GlobalProfit } from '@/types/charter'
import { FaSave, FaDownload } from 'react-icons/fa' // Import save and load icons

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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleProfitChange('ow', e.target.value)
              }
              className="mt-1"
            />
          </div>
        </div>

        {/* Updated Buttons with Icons and Labels */}
        <div className="flex gap-2">
          <Button
            onClick={onDownload}
            className="flex-1 flex items-center justify-center"
            title="Descargar"
          >
            <FaDownload className="mr-2" />
          </Button>
          <Button
            onClick={onSave}
            variant="outline"
            className="flex-1 flex items-center justify-center"
            title="Guardar Datos"
          >
            <FaSave className="mr-2" />
          </Button>
          <Button
            onClick={onLoad}
            variant="outline"
            className="flex-1 flex items-center justify-center"
            title="Cargar Datos"
          >
            <FaDownload className="mr-2 transform rotate-180" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChartControls
