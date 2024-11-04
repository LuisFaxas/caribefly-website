'use client'

import { useState } from 'react'
import { db } from '@/lib/firebaseConfig'
import { collection, doc, updateDoc, setDoc } from 'firebase/firestore'

interface Service {
  id: string
  title: string
  content: string
}

interface ServicesManagerProps {
  services: Service[]
  onUpdate: (services: Service[]) => void
}

export default function ServicesManager({
  services,
  onUpdate,
}: ServicesManagerProps) {
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleSaveService = async (service: Service) => {
    try {
      // Update in Firestore
      const serviceRef = doc(db, 'services', service.id)
      await setDoc(serviceRef, service, { merge: true })

      // Update local state
      const updatedServices = services.map((s) =>
        s.id === service.id ? service : s
      )
      onUpdate(updatedServices)
      setEditingService(null)
    } catch (error) {
      console.error('Error saving service:', error)
    }
  }

  return (
    <div className="space-y-6">
      {services.map((service) => (
        <div key={service.id} className="border rounded-lg p-4">
          {editingService?.id === service.id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editingService.title}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    title: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <textarea
                value={editingService.content}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    content: e.target.value,
                  })
                }
                className="w-full p-2 border rounded h-24"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSaveService(editingService)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <button
                  onClick={() => setEditingService(service)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              </div>
              <p className="text-gray-600">{service.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
