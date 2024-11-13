// app/components/flight-section/FlightTabContent.tsx
'use client'

import { FlightTab, Widget } from '@/types/dashboard'
import PriceChart from './PriceChart'
import Promotions from './Promotions'
import Announcements from './Announcements'

interface FlightTabContentProps {
  tab: FlightTab
  data: {
    charters: any[]
    promotions: any[]
    announcements: any[]
  }
}

export default function FlightTabContent({ tab, data }: FlightTabContentProps) {
  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'priceChart':
        return (
          <PriceChart
            charters={data.charters}
            autoUpdate={widget.settings?.autoUpdate}
          />
        )
      case 'promotionImage':
        return <Promotions images={data.promotions} />
      case 'announcement':
        return <Announcements announcements={data.announcements} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {tab.widgets
        .sort((a, b) => a.order - b.order)
        .map((widget) => (
          <div key={widget.id} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">{widget.title}</h2>
            {renderWidget(widget)}
          </div>
        ))}
    </div>
  )
}
