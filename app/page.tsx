"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const services = [
  { id: 'flights', title: 'Flights', content: '' },
  { id: 'shipping', title: 'Shipping', content: 'Send packages to Cuba easily.' },
  { id: 'rentals', title: 'Car Rentals', content: 'Book the best rental cars.' },
  { id: 'hotels', title: 'Hotels', content: 'Find affordable hotels in Cuba.' },
  { id: 'tours', title: 'Tours', content: 'Discover exciting tour packages.' },
]

const charters = [
  { id: 'xael', title: 'XAEL Charters', flights: [
    { route: 'Miami - Havana (Mon-Thu)', price: '$289' },
    { route: 'Miami - Havana (Fri-Sat)', price: '$319' },
    { route: 'Miami - Camagüey (Fri)', price: '$339' },
    { route: 'One Way (OW): Miami - Cuba', price: '$219' },
  ]},
  { id: 'cubazul', title: 'Cubazul', flights: [] },
  { id: 'invicta', title: 'Invicta', flights: [] },
  { id: 'havanaair', title: 'HavanaAir', flights: [] },
  { id: 'enjoy', title: 'Enjoy', flights: [] },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('flights')
  const [activeCharter, setActiveCharter] = useState('xael') // Default to 'XAEL'
  const router = useRouter()
  const [destination, setDestination] = useState('')
  const [dates, setDates] = useState('')
  const [passengers, setPassengers] = useState(1)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Searching flights to ${destination} on ${dates} for ${passengers} passengers`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-700">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">CaribeFly</h1>
        <div className="space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
          >
            Log In
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-white shadow-lg rounded-b-3xl p-10 mt-4">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Your Gateway to Cuba - Flights, Hotels, Rentals & More
        </h1>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="date"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            min="1"
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search Flights
          </button>
        </form>
      </div>

      {/* Tabbed Services Section */}
      <div className="container mx-auto mt-10">
        <div className="flex justify-center space-x-4 mb-6">
          {services.map((service) => (
            <button
              key={service.id}
              className={`px-6 py-3 rounded-lg text-lg font-semibold transition ${
                activeTab === service.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(service.id)}
            >
              {service.title}
            </button>
          ))}
        </div>

        {activeTab === 'flights' && (
          <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-md">
            {/* Sub-Tabs for Charters */}
            <div className="flex justify-center space-x-6 mb-6">
              {charters.map((charter) => (
                <button
                  key={charter.id}
                  className={`px-8 py-3 rounded-full text-lg font-medium shadow-lg transition ${
                    activeCharter === charter.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  onClick={() => setActiveCharter(charter.id)}
                >
                  {charter.title}
                </button>
              ))}
            </div>

            {/* Charter Flight Information */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                {charters.find((c) => c.id === activeCharter)?.title}
              </h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b-2 p-2">Route</th>
                    <th className="border-b-2 p-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {charters
                    .find((c) => c.id === activeCharter)
                    ?.flights.map((flight) => (
                      <tr key={flight.route}>
                        <td className="border-b p-2">{flight.route}</td>
                        <td className="border-b p-2">{flight.price}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-blue-600 text-white py-4 text-center">
        © {new Date().getFullYear()} CaribeFly - Your Travel Partner to Cuba
      </footer>
    </div>
  )
}
