// src/components/editors/BaggageInfoEditor.tsx

import { FC, ChangeEvent, useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Select from '@/components/ui/select'
import Toast from '@/components/ui/toast'
import { FaUndo, FaRedo, FaPlus, FaTrash } from 'react-icons/fa'
import type { DestinationData } from '@/types'

interface BaggageInfoEditorProps {
  destinationData: DestinationData
  onBaggageInfoUpdate: (newInfo: string[]) => void
}

// Template options for different baggage information presets
const baggageTemplates = {
  standard: [
    'Equipaje de mano hasta 25lb gratis',
    'Primera maleta 50lb incluida',
    'Maletas adicionales $2/lb',
    'Cargo por chequeo $25',
  ],
  light: [
    'Equipaje de mano hasta 15lb gratis',
    'Maletas adicionales $3/lb',
    'No incluye equipaje documentado',
  ],
  heavy: [
    'Equipaje de mano hasta 30lb gratis',
    'Dos maletas de 50lb incluidas',
    'Maletas adicionales $1.50/lb',
    'Cargo por sobrepeso $4/lb',
  ],
}

const BaggageInfoEditor: FC<BaggageInfoEditorProps> = ({
  destinationData,
  onBaggageInfoUpdate,
}) => {
  // State management
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [history, setHistory] = useState<string[][]>([[]])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [editMode, setEditMode] = useState<'list' | 'text'>('list')

  // Constants
  const characterLimit = 300
  const lineLimit = 6
  const currentInfo = destinationData.baggageInfo || []
  const currentLength = currentInfo.join('\n').length

  // Initialize history with current destination baggage info
  useEffect(() => {
    setHistory([destinationData.baggageInfo])
    setCurrentIndex(0)
  }, [destinationData, destinationData.baggageInfo])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleInfoChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value

    if (value.length <= characterLimit) {
      const lines = value.split('\n').slice(0, lineLimit)
      updateInfo(lines)
    } else {
      showNotification('error', 'Límite de caracteres alcanzado')
    }
  }

  const handleLineChange = (index: number, value: string) => {
    const updatedInfo = [...currentInfo]
    updatedInfo[index] = value
    updateInfo(updatedInfo)
  }

  const handleAddLine = () => {
    if (currentInfo.length >= lineLimit) {
      showNotification('error', 'Límite de líneas alcanzado')
      return
    }

    const updatedInfo = [...currentInfo, '']
    updateInfo(updatedInfo)
  }

  const handleRemoveLine = (index: number) => {
    const updatedInfo = currentInfo.filter((_, i) => i !== index)
    updateInfo(updatedInfo)
  }

  const handleTemplateSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const templateKey = event.target.value as keyof typeof baggageTemplates
    if (templateKey && baggageTemplates[templateKey]) {
      updateInfo(baggageTemplates[templateKey])
      showNotification('success', 'Plantilla aplicada')
    }
  }

  const updateInfo = (newInfo: string[]) => {
    onBaggageInfoUpdate(newInfo)
    const newHistory = [...history.slice(0, currentIndex + 1), newInfo]
    setHistory(newHistory)
    setCurrentIndex(currentIndex + 1)
    showNotification('success', 'Cambios guardados')
  }

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      onBaggageInfoUpdate(history[currentIndex - 1])
      showNotification('success', 'Cambio deshecho')
    }
  }

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1)
      onBaggageInfoUpdate(history[currentIndex + 1])
      showNotification('success', 'Cambio rehecho')
    }
  }

  return (
    <Card className="bg-gray-700 p-4 rounded-lg">
      <CardContent>
        {notification && (
          <Toast
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="flex flex-col gap-4">
          {/* Header with Controls */}
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold text-white">
              Información de Equipaje - {destinationData.destination}
            </Label>
            <div className="flex gap-2">
              <Button
                onClick={handleUndo}
                disabled={currentIndex === 0}
                variant="outline"
                size="sm"
                className={`flex items-center ${
                  currentIndex === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                }`}
                title="Deshacer"
              >
                <FaUndo className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleRedo}
                disabled={currentIndex === history.length - 1}
                variant="outline"
                size="sm"
                className={`flex items-center ${
                  currentIndex === history.length - 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                }`}
                title="Rehacer"
              >
                <FaRedo className="h-4 w-4" />
              </Button>
              <Button
                onClick={() =>
                  setEditMode(editMode === 'list' ? 'text' : 'list')
                }
                variant="outline"
                size="sm"
                className="bg-gray-600 hover:bg-gray-500 text-white"
              >
                {editMode === 'list' ? 'Modo Texto' : 'Modo Lista'}
              </Button>
            </div>
          </div>

          {/* Template Selector */}
          <Select
            onChange={handleTemplateSelect}
            defaultValue=""
            className="w-full bg-gray-600 text-white"
          >
            <option value="" disabled>
              Seleccionar plantilla...
            </option>
            <option value="standard">Equipaje Estándar</option>
            <option value="light">Equipaje Ligero</option>
            <option value="heavy">Equipaje Pesado</option>
          </Select>

          {/* Editor Area */}
          {editMode === 'text' ? (
            <Textarea
              value={currentInfo.join('\n')}
              onChange={handleInfoChange}
              placeholder="Ingrese la información de equipaje (una línea por ítem)"
              className="min-h-[150px] font-mono bg-gray-600 text-white"
              style={{
                resize: 'vertical',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
              }}
              spellCheck="false"
            />
          ) : (
            <div className="space-y-2">
              {currentInfo.map((info, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={info}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleLineChange(index, e.target.value)
                    }
                    className="flex-grow bg-gray-600 text-white"
                    placeholder={`Información ${index + 1}`}
                  />
                  <Button
                    onClick={() => handleRemoveLine(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
              {currentInfo.length < lineLimit && (
                <Button
                  onClick={handleAddLine}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 bg-gray-600 hover:bg-gray-500 text-white"
                >
                  <FaPlus className="mr-2" />
                  Agregar Línea
                </Button>
              )}
            </div>
          )}

          {/* Character Count */}
          <div className="flex justify-between items-center text-sm text-gray-300">
            <div>Máximo {lineLimit} líneas</div>
            <div>
              {currentLength}/{characterLimit} caracteres
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BaggageInfoEditor
