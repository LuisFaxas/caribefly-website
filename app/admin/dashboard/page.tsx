'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebaseConfig'
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'

// Types
interface Flight {
  route: string
  price: string
}

interface Charter {
  id: string
  title: string
  flights: Flight[]
}

interface Service {
  id: string
  title: string
  content: string
}

export default function AdminDashboard() {
  const { user, loading, isAdmin, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('services')

  // State for services and charters
  const [services, setServices] = useState<Service[]>([])
  const [charters, setCharters] = useState<Charter[]>([])
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingCharter, setEditingCharter] = useState<Charter | null>(null)
  const [newFlight, setNewFlight] = useState({ route: '', price: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from Firestore
  useEffect(() => {
    if (!user || !isAdmin) return

    const unsubscribeServices = onSnapshot(
      collection(db, 'services'),
      (snapshot) => {
        const servicesData: Service[] = []
        snapshot.forEach((doc) => {
          servicesData.push({ id: doc.id, ...doc.data() } as Service)
        })
        setServices(servicesData)
      },
      (error) => {
        console.error('Error fetching services:', error)
        setError('Error loading services')
      }
    )

    const unsubscribeCharters = onSnapshot(
      collection(db, 'charters'),
      (snapshot) => {
        const chartersData: Charter[] = []
        snapshot.forEach((doc) => {
          chartersData.push({ id: doc.id, ...doc.data() } as Charter)
        })
        setCharters(chartersData)
        setIsLoading(false)
      },
      (error) => {
        console.error('Error fetching charters:', error)
        setError('Error loading charters')
        setIsLoading(false)
      }
    )

    return () => {
      unsubscribeServices()
      unsubscribeCharters()
    }
  }, [user, isAdmin])

  // Save service to Firestore
  const handleSaveService = async (service: Service) => {
    try {
      const serviceRef = doc(db, 'services', service.id)
      await setDoc(
        serviceRef,
        {
          title: service.title,
          content: service.content,
        },
        { merge: true }
      )
      setEditingService(null)
    } catch (error) {
      console.error('Error saving service:', error)
      setError('Error saving service')
    }
  }

  // Save charter to Firestore
  const handleSaveCharter = async (charter: Charter) => {
    try {
      const charterRef = doc(db, 'charters', charter.id)
      await setDoc(
        charterRef,
        {
          title: charter.title,
          flights: charter.flights,
        },
        { merge: true }
      )
      setEditingCharter(null)
    } catch (error) {
      console.error('Error saving charter:', error)
      setError('Error saving charter')
    }
  }

  // Add new flight to charter
  const handleAddFlight = (charterId: string) => {
    if (!newFlight.route || !newFlight.price) return

    const charter = charters.find((c) => c.id === charterId)
    if (!charter) return

    const updatedCharter = {
      ...charter,
      flights: [...charter.flights, newFlight],
    }

    handleSaveCharter(updatedCharter)
    setNewFlight({ route: '', price: '' })
  }

  // Remove flight from charter
  const handleRemoveFlight = (charterId: string, flightIndex: number) => {
    const charter = charters.find((c) => c.id === charterId)
    if (!charter) return

    const updatedCharter = {
      ...charter,
      flights: charter.flights.filter((_, index) => index !== flightIndex),
    }

    handleSaveCharter(updatedCharter)
  }

  // Loading and auth checks
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              CaribeFly Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user.email}</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('charters')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'charters'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Charters
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Services Section */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Services</h2>
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
                        <h3 className="text-lg font-semibold">
                          {service.title}
                        </h3>
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
          </div>
        )}

        {/* Charters Section */}
        {activeTab === 'charters' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Charters</h2>
            <div className="space-y-8">
              {charters.map((charter) => (
                <div key={charter.id} className="border rounded-lg p-6">
                  {editingCharter?.id === charter.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingCharter.title}
                        onChange={(e) =>
                          setEditingCharter({
                            ...editingCharter,
                            title: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveCharter(editingCharter)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCharter(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">
                          {charter.title}
                        </h3>
                        <button
                          onClick={() => setEditingCharter(charter)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit Charter
                        </button>
                      </div>

                      {/* Flights Table */}
                      <table className="w-full">
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
                                  onClick={() =>
                                    handleRemoveFlight(charter.id, index)
                                  }
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
                            setNewFlight({
                              ...newFlight,
                              route: e.target.value,
                            })
                          }
                          className="flex-1 p-2 border rounded"
                        />
                        <input
                          type="text"
                          placeholder="Price"
                          value={newFlight.price}
                          onChange={(e) =>
                            setNewFlight({
                              ...newFlight,
                              price: e.target.value,
                            })
                          }
                          className="w-32 p-2 border rounded"
                        />
                        <button
                          onClick={() => handleAddFlight(charter.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Add Flight
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
