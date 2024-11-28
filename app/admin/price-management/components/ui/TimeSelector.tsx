import React from 'react'
import { Label, Input, Button } from '@/app/components/ui'
import type { FlightTime } from '@/types/charter'

interface TimeSelectorProps {
  days: string[]
  times: FlightTime[]
  onUpdate: (days: string[], times: FlightTime[]) => void
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  days,
  times,
  onUpdate,
}) => {
  const handleAddTime = () => {
    onUpdate(days, [...times, { ida: '', regreso: '' }])
  }

  const handleRemoveTime = (index: number) => {
    onUpdate(
      days,
      times.filter((_, i) => i !== index)
    )
  }

  const handleTimeChange = (
    index: number,
    type: 'ida' | 'regreso',
    value: string
  ) => {
    const newTimes = [...times]
    newTimes[index] = {
      ...newTimes[index],
      [type]: value,
    }
    onUpdate(days, newTimes)
  }

  const handleDayToggle = (day: string) => {
    const newDays = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day]
    onUpdate(newDays, times)
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="space-y-6">
      {/* Days Selection */}
      <div>
        <Label className="mb-2 block">Flight Days</Label>
        <div className="flex flex-wrap gap-2">
          {weekDays.map((day) => (
            <Button
              key={day}
              type="button"
              variant={days.includes(day) ? 'default' : 'outline'}
              onClick={() => handleDayToggle(day)}
              className="w-16"
            >
              {day}
            </Button>
          ))}
        </div>
      </div>

      {/* Times Selection */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Label>Flight Times</Label>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddTime}
            className="text-sm"
          >
            Add Time
          </Button>
        </div>
        <div className="space-y-4">
          {times.map((time, index) => (
            <div key={index} className="flex items-end gap-4">
              <div className="flex-1">
                <Label className="text-sm">Departure</Label>
                <Input
                  type="time"
                  value={time.ida}
                  onChange={(e) =>
                    handleTimeChange(index, 'ida', e.target.value)
                  }
                />
              </div>
              <div className="flex-1">
                <Label className="text-sm">Return</Label>
                <Input
                  type="time"
                  value={time.regreso}
                  onChange={(e) =>
                    handleTimeChange(index, 'regreso', e.target.value)
                  }
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleRemoveTime(index)}
                className="mb-[2px]"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TimeSelector
