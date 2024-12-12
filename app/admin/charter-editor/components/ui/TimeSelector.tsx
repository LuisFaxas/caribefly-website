// src/components/ui/TimeSelector.tsx

import React from 'react'
import Select from '../../../components/ui/select'
import * as Label from '@radix-ui/react-label'

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

  const hourOptions = hours.map((hour) => ({ label: hour, value: hour }))
  const minuteOptions = minutes.map((minute) => ({
    label: minute,
    value: minute,
  }))
  const periodOptions = periods.map((period) => ({
    label: period,
    value: period,
  }))

  // Handle time changes
  const handleIdaTimeChange = (
    type: 'hour' | 'minute' | 'period',
    value: string
  ) => {
    let newTime = ''
    if (type === 'hour') {
      newTime = `${to24Hour(value, ida12.period)}:${idaMinute || '00'}`
    } else if (type === 'minute') {
      newTime = `${to24Hour(ida12.hour, ida12.period)}:${value}`
    } else {
      newTime = `${to24Hour(ida12.hour, value)}:${idaMinute || '00'}`
    }
    onIdaChange(newTime)
  }

  const handleRegresoTimeChange = (
    type: 'hour' | 'minute' | 'period',
    value: string
  ) => {
    let newTime = ''
    if (type === 'hour') {
      newTime = `${to24Hour(value, regreso12.period)}:${regresoMinute || '00'}`
    } else if (type === 'minute') {
      newTime = `${to24Hour(regreso12.hour, regreso12.period)}:${value}`
    } else {
      newTime = `${to24Hour(regreso12.hour, value)}:${regresoMinute || '00'}`
    }
    onRegresoChange(newTime)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Departure Time */}
      <div className="space-y-2">
        <Label.Root className="text-sm font-medium text-white">
          {label} - Ida
        </Label.Root>
        <div className="flex items-center gap-2">
          <Select
            value={ida12.hour}
            onChange={(value: string) => handleIdaTimeChange('hour', value)}
            options={hourOptions}
            className="w-24 bg-gray-700 text-white border-gray-600 focus:text-white [&_option]:bg-white [&_option]:text-gray-900 [&_option]:px-1"
          />
          <span className="text-white">:</span>
          <Select
            value={idaMinute || '00'}
            onChange={(value: string) => handleIdaTimeChange('minute', value)}
            options={minuteOptions}
            className="w-24 bg-gray-700 text-white border-gray-600 focus:text-white [&_option]:bg-white [&_option]:text-gray-900 [&_option]:px-1"
          />
          <Select
            value={ida12.period}
            onChange={(value: string) => handleIdaTimeChange('period', value)}
            options={periodOptions}
            className="w-28 bg-gray-700 text-white border-gray-600 focus:text-white [&_option]:bg-white [&_option]:text-gray-900 [&_option]:px-1"
          />
        </div>
      </div>

      {/* Return Time */}
      <div className="space-y-2">
        <Label.Root className="text-sm font-medium text-white">
          {label} - Regreso
        </Label.Root>
        <div className="flex items-center gap-2">
          <Select
            value={regreso12.hour}
            onChange={(value: string) => handleRegresoTimeChange('hour', value)}
            options={hourOptions}
            className="w-24 bg-gray-700 text-white border-gray-600 focus:text-white [&_option]:bg-white [&_option]:text-gray-900 [&_option]:px-1"
          />
          <span className="text-white">:</span>
          <Select
            value={regresoMinute || '00'}
            onChange={(value: string) =>
              handleRegresoTimeChange('minute', value)
            }
            options={minuteOptions}
            className="w-24 bg-gray-700 text-white border-gray-600 focus:text-white [&_option]:bg-white [&_option]:text-gray-900 [&_option]:px-1"
          />
          <Select
            value={regreso12.period}
            onChange={(value: string) =>
              handleRegresoTimeChange('period', value)
            }
            options={periodOptions}
            className="w-28 bg-gray-700 text-white border-gray-600 focus:text-white [&_option]:bg-white [&_option]:text-gray-900 [&_option]:px-1"
          />
        </div>
      </div>
    </div>
  )
}

export default TimeSelector
