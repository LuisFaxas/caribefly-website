'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PriceSheet from '../components/preview/PriceSheet'
import { charterOperations } from '@/lib/firestore-utils'
import { CharterData, DestinationData } from '@/types/charter'
import { Button } from '@/app/components/ui/button'

export default function PreviewPage() {
  const searchParams = useSearchParams()
  const [charter, setCharter] = useState<CharterData | null>(null)
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const charterId = searchParams.get('charterId')
    const destinationIndex = searchParams.get('destinationIndex')

    if (!charterId || !destinationIndex) {
      setError('Missing required parameters')
      setLoading(false)
      return
    }

    const loadCharter = async () => {
      try {
        const result = await charterOperations.getById(charterId)
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to load charter')
        }

        const charter = result.data
        const destination = charter.destinations[parseInt(destinationIndex)]
        if (!destination) {
          throw new Error('Destination not found')
        }

        setCharter(charter)
        setSelectedDestination(destination)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadCharter()
  }, [searchParams])

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (error || !charter || !selectedDestination) {
    return (
      <div className="p-8">
        <div className="text-red-500 mb-4">
          {error || 'Charter or destination not found'}
        </div>
        <Button onClick={() => window.close()}>Close Preview</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Price Sheet Preview</h1>
        <div className="space-x-4">
          <Button onClick={() => window.print()}>Print</Button>
          <Button onClick={() => window.close()}>Close</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <PriceSheet
          charter={charter}
          selectedDestination={selectedDestination}
        />
      </div>
    </div>
  )
}
