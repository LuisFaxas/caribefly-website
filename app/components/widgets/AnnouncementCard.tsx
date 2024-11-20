'use client'

import React from 'react'
import { Widget } from '@/types/dashboard'

interface AnnouncementContent {
  title: string
  content: string
  type: 'info' | 'warning' | 'alert'
  priority: 'high' | 'normal' | 'low'
}

export const AnnouncementCard: React.FC<Widget> = ({ content }) => {
  const announcement = content as AnnouncementContent

  const getBgColor = () => {
    switch (announcement.type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'alert':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getTextColor = () => {
    switch (announcement.type) {
      case 'warning':
        return 'text-yellow-800'
      case 'alert':
        return 'text-red-800'
      default:
        return 'text-blue-800'
    }
  }

  const getPriorityBadgeColor = () => {
    switch (announcement.priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div
      className={`p-4 rounded-lg border ${getBgColor()} ${getTextColor()}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{announcement.title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor()}`}
        >
          {announcement.priority}
        </span>
      </div>
      <p className="text-sm">{announcement.content}</p>
    </div>
  )
}
