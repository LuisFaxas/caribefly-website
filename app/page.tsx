"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [destination, setDestination] = useState('')
  const [dates, setDates] = useState('')
  const [passengers, setPassengers] = useState(1)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Searching flights to ${destination} on ${dates} for ${passengers} passengers`)
    // Logic to redirect to flight search results can be added here
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

      {/* Services Section */}
      <div className="container mx-auto mt-10 p-4">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          Explore Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Flights to Cuba', description: 'Book charter flights with ease.', icon: '✈️' },
            { title: 'Shipping Services', description: 'Send packages to Cuba.', icon: '📦' },
            { title: 'Car Rentals in Cuba', description: 'Find the perfect rental car.', icon: '🚗' },
            { title: 'Hotel Reservations', description: 'Book top hotels in Cuba.', icon: '🏨' },
            { title: 'Tour Packages', description: 'Explore our guided tours.', icon: '🌴' },
            { title: 'More Services', description: 'Discover all we offer.', icon: '🔍' },
          ].map((service) => (
            <div
              key={service.title}
              className="p-6 bg-white rounded-lg shadow-md flex items-center space-x-4"
            >
              <span className="text-4xl">{service.icon}</span>
              <div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotions Section */}
      <div className="mt-16 bg-white py-10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Latest Promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: '50% off Flights', description: 'Limited-time offer on select flights.' },
              { title: 'Free Car Rental', description: 'Book a flight and get a free car rental.' },
              { title: 'Hotel Discounts', description: 'Save up to 30% on hotel stays.' },
            ].map((promo) => (
              <div
                key={promo.title}
                className="p-6 bg-blue-100 rounded-lg shadow-md hover:bg-blue-200 transition"
              >
                <h3 className="text-2xl font-semibold">{promo.title}</h3>
                <p className="mt-2">{promo.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-blue-600 text-white py-4 text-center">
        © {new Date().getFullYear()} CaribeFly - Your Travel Partner to Cuba
      </footer>
    </div>
  )
}
