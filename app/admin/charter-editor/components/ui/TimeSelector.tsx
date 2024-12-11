// src/components/ui/TimeSelector.tsx

import React from 'react'
import Select from '@/components/ui/select'
import { Label } from '@/components/ui/label'

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
  // Convert 24h to 12h format
  const to12Hour = (hour24: string) => {
    const hour = parseInt(hour24)
    if (hour === 0) return { hour: '12', period: 'AM' }
    if (hour === 12) return { hour: '12', period: 'PM' }
    if (hour > 12)
      return { hour: (hour - 12).toString().padStart(2, '0'), period: 'PM' }
    return { hour: hour.toString().padStart(2, '0'), period: 'AM' }
  }

  // Convert 12h to 24h format
  const to24Hour = (hour12: string, period: string) => {
    let hour = parseInt(hour12)
    if (period === 'PM' && hour !== 12) hour += 12
    if (period === 'AM' && hour === 12) hour = 0
    return hour.toString().padStart(2, '0')
  }

  // Parse current values
  const [idaHour24, idaMinute] = idaValue.split(':')
  const [regresoHour24, regresoMinute] = regresoValue.split(':')

  const ida12 = to12Hour(idaHour24 || '00')
  const regreso12 = to12Hour(regresoHour24 || '00')

  // Generate time options
  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  )
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  )
  const periods = ['AM', 'PM']

  // Handle time changes
  const handleIdaTimeChange = (
    type: 'hour' | 'minute' | 'period',
    value: string
  ) => {
    if (type === 'hour') {
      const hour24 = to24Hour(value, ida12.period)
      onIdaChange(`${hour24}:${idaMinute || '00'}`)
    } else if (type === 'period') {
      const hour24 = to24Hour(ida12.hour, value)
      onIdaChange(`${hour24}:${idaMinute || '00'}`)
    } else {
      onIdaChange(`${idaHour24 || '00'}:${value}`)
    }
  }

  const handleRegresoTimeChange = (
    type: 'hour' | 'minute' | 'period',
    value: string
  ) => {
    if (type === 'hour') {
      const hour24 = to24Hour(value, regreso12.period)
      onRegresoChange(`${hour24}:${regresoMinute || '00'}`)
    } else if (type === 'period') {
      const hour24 = to24Hour(regreso12.hour, value)
      onRegresoChange(`${hour24}:${regresoMinute || '00'}`)
    } else {
      onRegresoChange(`${regresoHour24 || '00'}:${value}`)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Departure Time */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-white">{label} - Ida</Label>
        <div className="flex items-center gap-2">
          <Select
            value={ida12.hour}
            onChange={(e) => handleIdaTimeChange('hour', e.target.value)}
            className="w-24 bg-gray-700 text-white border-gray-600 focus:text-white [&_option]:bg-white [&_option]:text-gray-900 [&_option]:px-1"
          >
            {hours.map((hour) => (
              <option
                key={`ida-hour-${hour}`}
                value={hour}
                className="text-gray-900 py-1"
              >
                {hour}
              </option>
            ))}
          </Select>
          <span className="text-white">:</span>
          <Select
            value={idaMinute || '00'}
            onChange={(e) => handleIdaTimeChange('minute', e.target.value)}
            className="w-24 bg-gray-700 text-white border-gray-600 focus:text-white [&_option]:bg-white [&_option]:text-gray-900 [&_option]:px-1"
          >
            {minutes.map((minute) => (
              <option
                key={`ida-min-${minute}`}
                value={minute}
                className="text-gray-900 py-1"
              >
                {minute}
              </option>
            ))}
          </Select>
          <Select
            value={ida12.period}
            onChange={(e) => handleIdaTimeChange('period', e.target.value)}
            className="w-28 bg-gray-700 text-white border-gray-600 focus:text-white [&_option]:bg-white [&_option]:text-gray-900 [&_option]:px-1"
          >
            {periods.map((period) => (
              <option
                key={`ida-period-${period}`}
                value={period}
                className="text-gray-900 py-1"
              >
                {period}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Return Time */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-white">
          {label} - Regreso
        </Label>
        <div className="flex items-center gap-2">
          <Select
            value={regreso12.hour}
            onChange={(e) => handleRegresoTimeChange('hour', e.target.value)}
            className="w-24 bg-gray-700 text-white border-gray-600 focus:text-white [&_option]:bg-white [&_option]:text-gray-900 [&_option]:px-1"
          >
            {hours.map((hour) => (
              <option
                key={`regreso-hour-${hour}`}
                value={hour}
                className="text-gray-900 py-1"
              >
                {hour}
              </option>
            ))}
          </Select>
          <span className="text-white">:</span>
          <Select
            value={regresoMinute || '00'}
            onChange={(e) => handleRegresoTimeChange('minute', e.target.value)}
            className="w-24 bg-gray-700 text-white border-gray-600 focus:text-white [&_option]:bg-white [&_option]:text-gray-900 [&_option]:px-1"
          >
            {minutes.map((minute) => (
              <option
                key={`regreso-min-${minute}`}
                value={minute}
                className="text-gray-900 py-1"
              >
                {minute}
              </option>
            ))}
          </Select>
          <Select
            value={regreso12.period}
            onChange={(e) => handleRegresoTimeChange('period', e.target.value)}
            className="w-28 bg-gray-700 text-white border-gray-600 focus:text-white [&_option]:bg-white [&_option]:text-gray-900 [&_option]:px-1"
          >
            {periods.map((period) => (
              <option
                key={`regreso-period-${period}`}
                value={period}
                className="text-gray-900 py-1"
              >
                {period}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}

export default TimeSelector
