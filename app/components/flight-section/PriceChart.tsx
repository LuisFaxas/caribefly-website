import React from 'react'
import { Charter } from '@/types/flight'

interface PriceChartProps {
  charters: Charter[]
  autoUpdate?: boolean
}

export default function PriceChart({
  charters,
  autoUpdate = false,
}: PriceChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Charter</th>
              <th className="px-4 py-2 text-left">Route</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-center">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {charters.map((charter) =>
              charter.flights?.map((flight, index) => (
                <tr key={`${charter.id}-${index}`} className="border-t">
                  <td className="px-4 py-2">{charter.title}</td>
                  <td className="px-4 py-2">{flight.route}</td>
                  <td className="px-4 py-2 text-right">{flight.price}</td>
                  <td className="px-4 py-2 text-center text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
