// app/admin/charter-editor/components/controls/TimeSelector.tsx

import React from 'react'
import { Select } from '@/app/admin/components/ui'
import { Label } from '@/app/admin/components/ui'

interface TimeSelectorProps {
  label: string
  idaValue: string
  regresoValue: string
  onIdaChange: (value: string) => void
  onRegresoChange: (value: string) => void
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  label,
  idaValue,
  regresoValue,
  onIdaChange,
  onRegresoChange,
}) => {
  // Parse current values
  const [idaHour, idaMinute] = idaValue.split(':')
  const [regresoHour, regresoMinute] = regresoValue.split(':')

  // Generate time options
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0')
  )
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  )

  // Handle time changes
  const handleIdaTimeChange = (type: 'hour' | 'minute', value: string) => {
    if (type === 'hour') {
      onIdaChange(`${value}:${idaMinute || '00'}`)
    } else {
      onIdaChange(`${idaHour || '00'}:${value}`)
    }
  }

  const handleRegresoTimeChange = (type: 'hour' | 'minute', value: string) => {
    if (type === 'hour') {
      onRegresoChange(`${value}:${regresoMinute || '00'}`)
    } else {
      onRegresoChange(`${regresoHour || '00'}:${value}`)
    }
  }

  const hoursOptions = hours.map((hour) => ({
    label: `${hour}h`,
    value: hour,
  }))

  const minutesOptions = minutes.map((minute) => ({
    label: `${minute}m`,
    value: minute,
  }))

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Departure Time */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-white">{label} - Ida</Label>
        <div className="flex items-center gap-2">
          <Select
            value={idaHour || '00'}
            onChange={(value: string) => handleIdaTimeChange('hour', value)}
            options={hoursOptions}
            className="w-24 bg-gray-700 text-white border-gray-600"
          />
          <span className="text-white">:</span>
          <Select
            value={idaMinute || '00'}
            onChange={(value: string) => handleIdaTimeChange('minute', value)}
            options={minutesOptions}
            className="w-24 bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>

      {/* Return Time */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-white">
          {label} - Regreso
        </Label>
        <div className="flex items-center gap-2">
          <Select
            value={regresoHour || '00'}
            onChange={(value: string) => handleRegresoTimeChange('hour', value)}
            options={hoursOptions}
            className="w-24 bg-gray-700 text-white border-gray-600"
          />
          <span className="text-white">:</span>
          <Select
            value={regresoMinute || '00'}
            onChange={(value: string) =>
              handleRegresoTimeChange('minute', value)
            }
            options={minutesOptions}
            className="w-24 bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>
    </div>
  )
}

export default TimeSelector
