// src/components/editors/TimeSelector.tsx

import React, { ChangeEvent } from 'react'
import Select from './select'
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
    const hour = parseInt(hour24, 10)
    const period = hour >= 12 ? 'PM' : 'AM'
    let hour12 = hour % 12
    if (hour12 === 0) hour12 = 12
    return { hour: hour12.toString().padStart(2, '0'), period }
  }

  // Convert 12h + period to 24h format
  const to24Hour = (hour12: string, period: string) => {
    let hour = parseInt(hour12, 10)
    if (period === 'PM' && hour !== 12) hour += 12
    if (period === 'AM' && hour === 12) hour = 0
    return hour.toString().padStart(2, '0')
  }

  // Parse ida times
  const [idaHour24, idaMinute = '00'] = idaValue.split(':')
  const ida12 = to12Hour(idaHour24 || '00')

  // Parse regreso times
  const [regresoHour24, regresoMinute = '00'] = regresoValue.split(':')
  const regreso12 = to12Hour(regresoHour24 || '00')

  // Generate dropdown option values
  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  )
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  )
  const periods = ['AM', 'PM']

  const handleIdaTimeChange = (
    type: 'hour' | 'minute' | 'period',
    value: string
  ) => {
    let newHour = ida12.hour
    let newMinute = idaMinute
    let newPeriod = ida12.period

    if (type === 'hour') newHour = value
    if (type === 'minute') newMinute = value
    if (type === 'period') newPeriod = value

    const newHour24 = to24Hour(newHour, newPeriod)
    onIdaChange(`${newHour24}:${newMinute}`)
  }

  const handleRegresoTimeChange = (
    type: 'hour' | 'minute' | 'period',
    value: string
  ) => {
    let newHour = regreso12.hour
    let newMinute = regresoMinute
    let newPeriod = regreso12.period

    if (type === 'hour') newHour = value
    if (type === 'minute') newMinute = value
    if (type === 'period') newPeriod = value

    const newHour24 = to24Hour(newHour, newPeriod)
    onRegresoChange(`${newHour24}:${newMinute}`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Ida Time */}
      <div className="space-y-2">
        <Label.Root className="text-sm font-semibold text-white">
          {label} - Ida
        </Label.Root>
        <div className="flex items-center gap-2">
          <Select
            value={ida12.hour}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleIdaTimeChange('hour', e.target.value)
            }
            className="w-20 bg-gray-700 text-white border-gray-500"
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </Select>

          <span className="text-white">:</span>

          <Select
            value={idaMinute}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleIdaTimeChange('minute', e.target.value)
            }
            className="w-20 bg-gray-700 text-white border-gray-500"
          >
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>

          <Select
            value={ida12.period}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleIdaTimeChange('period', e.target.value)
            }
            className="w-24 bg-gray-700 text-white border-gray-500"
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Regreso Time */}
      <div className="space-y-2">
        <Label.Root className="text-sm font-semibold text-white">
          {label} - Regreso
        </Label.Root>
        <div className="flex items-center gap-2">
          <Select
            value={regreso12.hour}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleRegresoTimeChange('hour', e.target.value)
            }
            className="w-20 bg-gray-700 text-white border-gray-500"
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </Select>

          <span className="text-white">:</span>

          <Select
            value={regresoMinute}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleRegresoTimeChange('minute', e.target.value)
            }
            className="w-20 bg-gray-700 text-white border-gray-500"
          >
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>

          <Select
            value={regreso12.period}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleRegresoTimeChange('period', e.target.value)
            }
            className="w-24 bg-gray-700 text-white border-gray-500"
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}

export default TimeSelector
