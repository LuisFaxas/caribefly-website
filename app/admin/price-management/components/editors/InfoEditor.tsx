import React from 'react'
import { Input, Button } from '@/app/components/ui'

interface InfoEditorProps {
  info: string[]
  onUpdate: (info: string[]) => void
  label?: string
}

const InfoEditor: React.FC<InfoEditorProps> = ({
  info,
  onUpdate,
  label = 'Additional Info',
}) => {
  const handleAdd = () => {
    onUpdate([...info, ''])
  }

  const handleRemove = (index: number) => {
    const newInfo = info.filter((_, i) => i !== index)
    onUpdate(newInfo)
  }

  const handleChange = (index: number, value: string) => {
    const newInfo = [...info]
    newInfo[index] = value
    onUpdate(newInfo)
  }

  return (
    <div className="space-y-4">
      {info.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
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
        Add {label}
      </Button>
    </div>
  )
}

export default InfoEditor
