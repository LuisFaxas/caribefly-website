//homepage
'use client'

// Import React hooks
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Define the service tabs with titles and content (for customization later)
const services = [
  { id: 'flights', title: 'Flights', content: '' },
  {
    id: 'shipping',
    title: 'Shipping',
    content: 'Send packages to Cuba easily.',
  },
  {
    id: 'rentals',
    title: 'Car Rentals',
    content: 'Book the best rental cars.',
  },
  { id: 'hotels', title: 'Hotels', content: 'Find affordable hotels in Cuba.' },
  { id: 'tours', title: 'Tours', content: 'Discover exciting tour packages.' },
]

// Define the charter options with a title and flights (these can be customized with real data)
const charters = [
  {
    id: 'xael',
    title: 'XAEL Charters',
    flights: [
      { route: 'Miami - Havana (Mon-Thu)', price: '$289' },
      { route: 'Miami - Havana (Fri-Sat)', price: '$319' },
      { route: 'Miami - Camagüey (Fri)', price: '$339' },
      { route: 'One Way (OW): Miami - Cuba', price: '$219' },
    ],
  },
  { id: 'cubazul', title: 'Cubazul', flights: [] },
  { id: 'invicta', title: 'Invicta', flights: [] },
  { id: 'havanaair', title: 'HavanaAir', flights: [] },
  { id: 'enjoy', title: 'Enjoy', flights: [] },
]

export default function Home() {
  // State for active service and charter tabs
  const [activeTab, setActiveTab] = useState('flights')
  const [activeCharter, setActiveCharter] = useState('xael') // Default to 'XAEL'
  const router = useRouter()

  // State for flight search form inputs
  const [destination, setDestination] = useState('')
  const [dates, setDates] = useState('')
  const [passengers, setPassengers] = useState(1)

  // Handler for the search form submission (currently logs input data to console)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(
      `Searching flights to ${destination} on ${dates} for ${passengers} passengers`
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-700">
      {/* Header section with logo and navigation buttons */}
      <header className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 text-center md:text-left">
          CaribeFly
        </h1>
        <div className="mt-2 md:mt-0 space-x-2 flex justify-center">
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

      {/* Hero section with main title and search form */}
      <div className="relative bg-white shadow-lg rounded-b-3xl p-6 md:p-10 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          Your Gateway to Cuba - Flights, Hotels, Rentals & More
        </h1>
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          {/* Search input fields for destination, date, and passengers */}
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
          {/* Search button spanning full width on mobile */}
          <button
            type="submit"
            className="md:col-span-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search Flights
          </button>
        </form>
      </div>

      {/* Tabbed services section with scrollable service tabs */}
      <div className="container mx-auto mt-8 md:mt-10 px-4 md:px-0">
        {/* Service tabs for Flights, Shipping, Rentals, Hotels, Tours */}
        <div className="flex overflow-x-auto space-x-2 md:space-x-4 mb-4 md:mb-6 justify-start snap-x snap-mandatory">
          {services.map((service) => (
            <button
              key={service.id}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-lg font-semibold transition whitespace-nowrap snap-start ${
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

        {/* Flight charter sub-section when the Flights tab is active */}
        {activeTab === 'flights' && (
          <div className="bg-gradient-to-br from-white to-blue-50 p-4 md:p-8 rounded-xl shadow-md overflow-visible">
            {/* Charter buttons for each charter option */}
            <div className="flex overflow-x-auto overflow-y-visible space-x-2 md:space-x-6 mb-4 md:mb-6 justify-start snap-x snap-mandatory">
              {charters.map((charter) => (
                <button
                  key={charter.id}
                  className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-lg font-medium shadow-lg transition whitespace-nowrap snap-start mb-5 ${
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

            {/* Display flight information for the selected charter */}
            <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">
                {charters.find((c) => c.id === activeCharter)?.title}
              </h2>
              <table className="w-full text-left border-collapse text-sm md:text-base">
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

      {/* Footer section */}
      <footer className="mt-10 md:mt-16 bg-blue-600 text-white py-4 text-center text-sm md:text-base">
        © {new Date().getFullYear()} CaribeFly - Your Travel Partner to Cuba
      </footer>
    </div>
  )
}
