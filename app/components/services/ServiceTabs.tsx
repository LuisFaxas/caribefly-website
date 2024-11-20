'use client'

import { Service } from '@/types/flight'

interface ServiceTabsProps {
  services: Service[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function ServiceTabs({ services, activeTab, onTabChange }: ServiceTabsProps) {
  return (
    <div 
      className="flex overflow-x-auto space-x-2 md:space-x-4 mb-4 md:mb-6 justify-start snap-x snap-mandatory"
      role="tablist"
      aria-label="Service categories"
    >
      {services.map((service) => (
        <button
          key={service.id}
          role="tab"
          aria-selected={activeTab === service.id}
          aria-controls={`${service.id}-panel`}
          id={`${service.id}-tab`}
          className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-lg font-semibold transition whitespace-nowrap snap-start focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            activeTab === service.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
          onClick={() => onTabChange(service.id)}
        >
          {service.title}
        </button>
      ))}
    </div>
  )
}
