'use client'

import React, { useState } from 'react'
import { TabSection, SubTab, Widget } from '@/types/dashboard'
import { PriceChart } from './widgets/PriceChart'
import { PromotionCard } from './widgets/PromotionCard'
import { AnnouncementCard } from './widgets/AnnouncementCard'

interface ServiceTabsProps {
  sections: TabSection[]
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || ''
  )
  const [activeSubTab, setActiveSubTab] = useState<string>(
    sections[0]?.subTabs[0]?.id || ''
  )

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'priceChart':
        return <PriceChart {...widget} />
      case 'promotionImage':
        return <PromotionCard {...widget} />
      case 'announcement':
        return <AnnouncementCard {...widget} />
      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {/* Main Service Tabs */}
      <div className="flex space-x-1 rounded-xl bg-gray-900/20 p-1 mb-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              setActiveSection(section.id)
              setActiveSubTab(section.subTabs[0]?.id || '')
            }}
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${
                activeSection === section.id
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-100 hover:bg-white/[0.12] hover:text-white'
              }
            `}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Sub Tabs */}
      {sections.map(
        (section) =>
          activeSection === section.id && (
            <div key={section.id} className="space-y-4">
              <div className="flex space-x-2 border-b border-gray-200">
                {section.subTabs.map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => setActiveSubTab(subTab.id)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors
                      ${
                        activeSubTab === subTab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    {subTab.title}
                  </button>
                ))}
              </div>

              {/* Widget Content */}
              {section.subTabs.map(
                (subTab) =>
                  activeSubTab === subTab.id && (
                    <div
                      key={subTab.id}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {subTab.widgets.map((widget) => (
                        <div
                          key={widget.id}
                          className="bg-white rounded-lg shadow-lg p-4"
                        >
                          {renderWidget(widget)}
                        </div>
                      ))}
                    </div>
                  )
              )}
            </div>
          )
      )}
    </div>
  )
}

export default ServiceTabs
