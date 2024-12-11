// src/components/editors/InfoEditor.tsx

import { FC, ChangeEvent, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Select from '@/components/ui/select'
import Toast from '@/components/ui/toast'
import { FaPlus, FaTrash } from 'react-icons/fa'
import type { DestinationData } from '@/types'

interface InfoEditorProps {
  destinationData: DestinationData
  onInfoUpdate: (newInfo: string[]) => void
}

// Template options for different information presets
const infoTemplates = {
  standard: [
    'Impuestos USA incluidos',
    'Tasa de salida: $27',
    'Tasa sanitaria: $35',
    'Cargo por reserva: $9',
    'Recarga de combustible: $25',
  ],
  holiday: [
    'Precios especiales de temporada',
    'Equipaje limitado a 40lb',
    'Check-in 3 horas antes',
    'Cargo adicional: $35/lb',
  ],
  baggage: [
    'Equipaje de mano hasta 25lb gratis',
    'Primera maleta 50lb incluida',
    'Maletas adicionales $2/lb',
    'Cargo por chequeo $25',
  ],
  havana: [
    'Impuestos USA incluidos',
    'Tasa de salida HAV: $27',
    'Tasa sanitaria HAV: $35',
    'VIP lounge disponible por $25',
    'Tiempo de check-in: 3 horas',
  ],
  santaClara: [
    'Impuestos USA incluidos',
    'Tasa de salida SNU: $27',
    'Tasa sanitaria SNU: $35',
    'Documentación adicional requerida',
    'Tiempo de check-in: 4 horas',
  ],
}

const InfoEditor: FC<InfoEditorProps> = ({ destinationData, onInfoUpdate }) => {
  // State management
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [editMode, setEditMode] = useState<'list' | 'text'>('list')

  // Constants
  const characterLimit = 500
  const lineLimit = 10
  const currentInfo = destinationData.additionalInfo
  const currentLength = currentInfo.join('\n').length

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
    const templateKey = event.target.value as keyof typeof infoTemplates
    if (templateKey && infoTemplates[templateKey]) {
      updateInfo(infoTemplates[templateKey])
      showNotification('success', 'Plantilla aplicada')
    }
  }

  const updateInfo = (newInfo: string[]) => {
    onInfoUpdate(newInfo)
    showNotification('success', 'Cambios guardados')
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
            <Label className="text-lg font-semibold text-white flex-grow whitespace-nowrap">
              Informacion - {destinationData.destination} &nbsp;
            </Label>
            <div className="flex gap-2">
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
            <option value="standard">Información Estándar</option>
            <option value="holiday">Temporada Alta</option>
            <option value="baggage">Política de Equipaje</option>
            <option value="havana">Específico HAV</option>
            <option value="santaClara">Específico SNU</option>
          </Select>

          {/* Editor Area */}
          {editMode === 'text' ? (
            <Textarea
              value={currentInfo.join('\n')}
              onChange={handleInfoChange}
              placeholder="Ingrese la información adicional (una línea por ítem)"
              className="min-h-[200px] font-mono bg-gray-600 text-white"
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

export default InfoEditor
