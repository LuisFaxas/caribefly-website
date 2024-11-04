'use client'

import { useState } from 'react'
import { db } from '@/lib/firebaseConfig'
import { collection, doc, updateDoc, setDoc } from 'firebase/firestore'

interface Flight {
  route: string
  price: string
}

interface Charter {
  id: string
  title: string
  flights: Flight[]
}

interface ChartersManagerProps {
  charters: Charter[]
  onUpdate: (charters: Charter[]) => void
}

export default function ChartersManager({
  charters,
  onUpdate,
}: ChartersManagerProps) {
  const [editingCharter, setEditingCharter] = useState<Charter | null>(null)
  const [newFlight, setNewFlight] = useState<Flight>({ route: '', price: '' })

  const handleSaveCharter = async (charter: Charter) => {
    try {
      // Update in Firestore
      const charterRef = doc(db, 'charters', charter.id)
      await setDoc(charterRef, charter, { merge: true })

      // Update local state
      const updatedCharters = charters.map((c) =>
        c.id === charter.id ? charter : c
      )
      onUpdate(updatedCharters)
      setEditingCharter(null)
    } catch (error) {
      console.error('Error saving charter:', error)
    }
  }

  const handleAddFlight = (charter: Charter) => {
    if (newFlight.route && newFlight.price) {
      const updatedCharter = {
        ...charter,
        flights: [...charter.flights, newFlight],
      }
      handleSaveCharter(updatedCharter)
      setNewFlight({ route: '', price: '' })
    }
  }

  return (
    <div className="space-y-8">
      {charters.map((charter) => (
        <div key={charter.id} className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{charter.title}</h3>
            <button
              onClick={() => setEditingCharter(charter)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Charter
            </button>
          </div>

          {/* Flights Table */}
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="text-left pb-2">Route</th>
                <th className="text-left pb-2">Price</th>
                <th className="text-left pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {charter.flights.map((flight, index) => (
                <tr key={index}>
                  <td className="py-2">{flight.route}</td>
                  <td className="py-2">{flight.price}</td>
                  <td className="py-2">
                    <button
                      onClick={() => {
                        const updatedCharter = {
                          ...charter,
                          flights: charter.flights.filter(
                            (_, i) => i !== index
                          ),
                        }
                        handleSaveCharter(updatedCharter)
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add New Flight */}
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Route"
              value={newFlight.route}
              onChange={(e) =>
                setNewFlight({ ...newFlight, route: e.target.value })
              }
              className="flex-1 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Price"
              value={newFlight.price}
              onChange={(e) =>
                setNewFlight({ ...newFlight, price: e.target.value })
              }
              className="w-32 p-2 border rounded"
            />
            <button
              onClick={() => handleAddFlight(charter)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Flight
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
