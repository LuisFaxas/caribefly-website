'use client'

import React from 'react'
import type { FlightTab } from '@/types/dashboard'

interface DestinationTabsProps {
  tabs: FlightTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

const DestinationTabs: React.FC<DestinationTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex space-x-1 rounded-xl bg-gray-900/20 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5
            ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-100 hover:bg-white/[0.12] hover:text-white'
            }
          `}
        >
          {tab.name}
        </button>
      ))}
    </div>
  )
}

export default DestinationTabs
