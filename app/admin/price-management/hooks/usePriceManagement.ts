import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, doc, onSnapshot, writeBatch } from 'firebase/firestore'
import { charterOperations } from '@/lib/firestore-utils'
import {
  CharterData,
  DestinationData,
  GlobalProfit,
  ValidationError,
  CharterUpdate,
} from '@/types/charter'

export interface UsePriceManagementProps {
  charterId: string
}

export interface UsePriceManagementReturn {
  data: CharterData | null
  loading: boolean
  error: Error | null
  selectedDestination: string | null
  setSelectedDestination: (destination: string | null) => void
  updateDestination: (
    destinationIndex: number,
    data: Partial<DestinationData>
  ) => Promise<void>
  updateCharterPrices: (data: CharterUpdate) => Promise<void>
  globalProfit: GlobalProfit
  updateGlobalProfit: (profit: GlobalProfit) => Promise<void>
  validationErrors: ValidationError[]
  clearValidationErrors: () => void
}

export function usePriceManagement({
  charterId,
}: UsePriceManagementProps): UsePriceManagementReturn {
  const [data, setData] = useState<CharterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  )
  const [globalProfit, setGlobalProfit] = useState<GlobalProfit>({
    rt: 20,
    ow: 20,
  })
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  )

  // Subscribe to charter updates
  useEffect(() => {
    setLoading(true)
    setError(null)

    const unsubscribe = onSnapshot(
      doc(db, 'charters', charterId),
      (doc) => {
        if (doc.exists()) {
          const charterData = { id: doc.id, ...doc.data() } as CharterData
          setData(charterData)
          setGlobalProfit({
            rt: charterData.globalProfit || 20,
            ow: charterData.globalProfit || 20,
          })

          // Auto-select first destination if none selected
          if (!selectedDestination && charterData.destinations?.length > 0) {
            setSelectedDestination(charterData.destinations[0].destination)
          }
        } else {
          setData(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching charter data:', err)
        setError(err as Error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [charterId, selectedDestination])

  const updateDestination = async (
    destinationIndex: number,
    destinationData: Partial<DestinationData>
  ) => {
    try {
      setError(null)
      setValidationErrors([])

      const result = await charterOperations.updateDestination(
        charterId,
        destinationIndex,
        destinationData
      )

      if (!result.success && result.error) {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Error updating destination:', err)
      setError(err as Error)
      throw err
    }
  }

  const updateCharterPrices = async (data: CharterUpdate) => {
    try {
      setError(null)
      setValidationErrors([])

      const result = await charterOperations.update(charterId, data)

      if (!result.success && result.error) {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Error updating charter prices:', err)
      setError(err as Error)
      throw err
    }
  }

  const updateGlobalProfit = async (profit: GlobalProfit) => {
    try {
      setError(null)
      setValidationErrors([])

      const batch = writeBatch(db)
      const charterRef = doc(db, 'charters', charterId)

      batch.update(charterRef, {
        globalProfit: profit.rt,
        lastUpdated: new Date().toISOString(),
      })

      await batch.commit()
      setGlobalProfit(profit)
    } catch (err) {
      console.error('Error updating global profit:', err)
      setError(err as Error)
      throw err
    }
  }

  const clearValidationErrors = () => {
    setValidationErrors([])
  }

  return {
    data,
    loading,
    error,
    selectedDestination,
    setSelectedDestination,
    updateDestination,
    updateCharterPrices,
    globalProfit,
    updateGlobalProfit,
    validationErrors,
    clearValidationErrors,
  }
}
