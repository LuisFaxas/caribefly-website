import React from 'react'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'

interface BaggageInfoEditorProps {
  baggageInfo: string[]
  onChange: (info: string[]) => void
}

const BaggageInfoEditor: React.FC<BaggageInfoEditorProps> = ({
  baggageInfo,
  onChange,
}) => {
  const handleAdd = () => {
    onChange([...baggageInfo, ''])
  }

  const handleRemove = (index: number) => {
    const newInfo = baggageInfo.filter((_, i) => i !== index)
    onChange(newInfo)
  }

  const handleChange = (index: number, value: string) => {
    const newInfo = [...baggageInfo]
    newInfo[index] = value
    onChange(newInfo)
  }

  return (
    <div className="space-y-4">
      {baggageInfo.map((info, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={info}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder="Enter baggage info"
            className="flex-1"
          />
          <Button
            variant="destructive"
            onClick={() => handleRemove(index)}
            className="px-2"
          >
            Remove
          </Button>
        </div>
      ))}
      <Button onClick={handleAdd} className="w-full">
        Add Baggage Info
      </Button>
    </div>
  )
}

export default BaggageInfoEditor
