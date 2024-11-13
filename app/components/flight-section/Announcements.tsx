// app/components/flight-section/Announcements.tsx
'use client'

import { Announcement } from '@/types/dashboard'

interface AnnouncementsProps {
  announcements: Announcement[]
}

export default function Announcements({ announcements }: AnnouncementsProps) {
  const activeAnnouncements = announcements.filter(
    (announcement) =>
      announcement.active &&
      new Date() >= new Date(announcement.validFrom) &&
      new Date() <= new Date(announcement.validUntil)
  )

  if (activeAnnouncements.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {activeAnnouncements.map((announcement) => (
        <div
          key={announcement.id}
          className={`p-4 rounded-lg ${
            announcement.type === 'alert'
              ? 'bg-red-50 border-l-4 border-red-500'
              : announcement.type === 'warning'
                ? 'bg-yellow-50 border-l-4 border-yellow-500'
                : 'bg-blue-50 border-l-4 border-blue-500'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">
                {announcement.title}
              </h4>
              <p className="text-gray-800 mt-1">{announcement.content}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                announcement.priority === 'high'
                  ? 'bg-red-100 text-red-800'
                  : announcement.priority === 'normal'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}
            >
              {announcement.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
