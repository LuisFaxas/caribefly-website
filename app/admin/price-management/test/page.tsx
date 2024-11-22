'use client'

import { useState } from 'react'
import PriceSheet from '../components/sheets/PriceSheet'
import EditorToolbar from '../components/controls/EditorToolbar'
import PriceEditor from '../components/editors/PriceEditor'
import type { CharterData } from '@/types/charter'

// Sample data for testing
const sampleCharter: CharterData = {
  id: 'test-charter',
  name: 'Test Charter',
  destinations: [
    {
      destination: 'MIA-HAV',
      flightDays: ['Lunes y Jueves', 'Miércoles y Sábado'],
      flightTimes: [
        { ida: '10:00', regreso: '12:00' },
        { ida: '14:00', regreso: '16:00' },
      ],
      periods: [
        {
          label: 'Temporada Alta',
          rt: 599,
          ow: 349,
          profitOverride: {},
        },
        {
          label: 'Temporada Baja',
          rt: 499,
          ow: 299,
          profitOverride: {},
        },
      ],
      baggageInfo: ['Equipaje de Mano: 10kg', 'Maleta Documentada: 23kg'],
      additionalInfo: ['Incluye impuestos y cargos', 'Sujeto a disponibilidad'],
    },
  ],
}

export default function TestPage() {
  const [charters, setCharters] = useState<CharterData[]>([sampleCharter])
  const [selectedDestination, setSelectedDestination] = useState('MIA-HAV')
  const [selectedCharterIndex, setSelectedCharterIndex] = useState(0)
  const [agencyLogo, setAgencyLogo] = useState('')
  const [promotionalImage, setPromotionalImage] = useState('')

  const handleCharterUpdate = (updatedCharters: CharterData[]) => {
    setCharters(updatedCharters)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Price Management Test Page</h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Toolbar */}
          <div className="col-span-3">
            <EditorToolbar
              charters={charters}
              selectedDestination={selectedDestination}
              onDestinationChange={setSelectedDestination}
              selectedCharterIndex={selectedCharterIndex}
              onSelectCharter={setSelectedCharterIndex}
              onCharterUpdate={handleCharterUpdate}
              onAgencyLogoChange={setAgencyLogo}
              onPromotionalImageChange={setPromotionalImage}
              onSave={() => console.log('Save clicked')}
              onLoad={() => console.log('Load clicked')}
              onDownload={() => console.log('Download clicked')}
              globalProfit={{}}
              onGlobalProfitChange={() => {}}
            />
          </div>

          {/* Editor */}
          <div className="col-span-9">
            <PriceEditor
              charters={charters}
              selectedDestination={selectedDestination}
              selectedCharterIndex={selectedCharterIndex}
            />
          </div>
        </div>

        {/* Price Sheet Preview */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Price Sheet Preview</h2>
          <PriceSheet
            charters={charters}
            selectedDestination={selectedDestination}
            agencyLogo={agencyLogo}
            promotionalImage={promotionalImage}
          />
        </div>
      </div>
    </div>
  )
}
