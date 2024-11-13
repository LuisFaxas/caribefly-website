'use client'

import { useState } from 'react'
import { Announcement } from '@/types/dashboard'

interface AnnouncementsManagerProps {
  announcements: Announcement[]
  onUpdate: (announcements: Announcement[]) => void
}

export default function AnnouncementsManager({
  announcements,
  onUpdate,
}: AnnouncementsManagerProps) {
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleSaveAnnouncement = async (announcement: Announcement) => {
    const updatedAnnouncements = editingAnnouncement
      ? announcements.map((a) => (a.id === announcement.id ? announcement : a))
      : [...announcements, announcement]
    onUpdate(updatedAnnouncements)
    setEditingAnnouncement(null)
  }

  const handleDeleteAnnouncement = (id: string) => {
    const updatedAnnouncements = announcements.filter((a) => a.id !== id)
    onUpdate(updatedAnnouncements)
    setDeleteConfirm(null)
  }

  const handleAddAnnouncement = () => {
    const newAnnouncement: Announcement = {
      id: `announcement-${Date.now()}`,
      title: 'New Announcement',
      content: '',
      priority: 'normal',
      type: 'info',
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      active: true,
      order: announcements.length,
    }
    setEditingAnnouncement(newAnnouncement)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Announcements</h2>
        <button
          onClick={handleAddAnnouncement}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Announcement
        </button>
      </div>

      {editingAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">
              {editingAnnouncement.id.startsWith('announcement-')
                ? 'New'
                : 'Edit'}{' '}
              Announcement
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={editingAnnouncement.title}
                  onChange={(e) =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      title: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  value={editingAnnouncement.content}
                  onChange={(e) =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      content: e.target.value,
                    })
                  }
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    value={editingAnnouncement.priority}
                    onChange={(e) =>
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        priority: e.target.value as 'low' | 'normal' | 'high',
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={editingAnnouncement.type}
                    onChange={(e) =>
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        type: e.target.value as 'info' | 'warning' | 'alert',
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valid From
                  </label>
                  <input
                    type="datetime-local"
                    value={editingAnnouncement.validFrom
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(e) =>
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        validFrom: new Date(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valid Until
                  </label>
                  <input
                    type="datetime-local"
                    value={editingAnnouncement.validUntil
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(e) =>
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        validUntil: new Date(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingAnnouncement.order}
                  onChange={(e) =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      order: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingAnnouncement.active}
                  onChange={(e) =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      active: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setEditingAnnouncement(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveAnnouncement(editingAnnouncement)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements
          .sort((a, b) => a.order - b.order)
          .map((announcement) => (
            <div
              key={announcement.id}
              className={`border rounded-lg p-4 ${
                announcement.type === 'alert'
                  ? 'border-red-200 bg-red-50'
                  : announcement.type === 'warning'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold flex items-center">
                    {announcement.title}
                    <span
                      className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        announcement.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : announcement.priority === 'normal'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {announcement.priority}
                    </span>
                  </h3>
                  <p className="mt-2 text-gray-600">{announcement.content}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>Order: {announcement.order}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {announcement.validFrom.toLocaleDateString()} -{' '}
                      {announcement.validUntil.toLocaleDateString()}
                    </span>
                    <span className="mx-2">•</span>
                    <span
                      className={
                        announcement.active ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {announcement.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setEditingAnnouncement(announcement)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    Edit
                  </button>
                  {deleteConfirm === announcement.id ? (
                    <>
                      <button
                        onClick={() =>
                          handleDeleteAnnouncement(announcement.id)
                        }
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(announcement.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
