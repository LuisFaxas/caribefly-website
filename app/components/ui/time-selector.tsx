import React from 'react'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import { FaClock } from 'react-icons/fa'

interface TimeSelectorProps {
  idaValue: string
  regresoValue: string
  onIdaChange: (value: string) => void
  onRegresoChange: (value: string) => void
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  idaValue,
  regresoValue,
  onIdaChange,
  onRegresoChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-gray-300">Departure Time</Label>
        <div className="flex items-center mt-1">
          <FaClock className="text-gray-400 mr-2" />
          <Input
            type="time"
            value={idaValue}
            onChange={(e) => onIdaChange(e.target.value)}
            className="bg-gray-800 border-gray-600 text-gray-200"
          />
        </div>
      </div>
      <div>
        <Label className="text-gray-300">Return Time</Label>
        <div className="flex items-center mt-1">
          <FaClock className="text-gray-400 mr-2" />
          <Input
            type="time"
            value={regresoValue}
            onChange={(e) => onRegresoChange(e.target.value)}
            className="bg-gray-800 border-gray-600 text-gray-200"
          />
        </div>
      </div>
    </div>
  )
}
