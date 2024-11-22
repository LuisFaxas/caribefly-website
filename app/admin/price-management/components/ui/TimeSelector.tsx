import React from 'react'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'

interface TimeSelectorProps {
  label: string
  idaValue: string
  regresoValue: string
  onIdaChange: (time: string) => void
  onRegresoChange: (time: string) => void
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  label,
  idaValue,
  regresoValue,
  onIdaChange,
  onRegresoChange,
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-white">{label}</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-300">Ida</Label>
          <Input
            type="time"
            value={idaValue}
            onChange={(e) => onIdaChange(e.target.value)}
            className="mt-1 bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div>
          <Label className="text-gray-300">Regreso</Label>
          <Input
            type="time"
            value={regresoValue}
            onChange={(e) => onRegresoChange(e.target.value)}
            className="mt-1 bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>
    </div>
  )
}

export default TimeSelector
