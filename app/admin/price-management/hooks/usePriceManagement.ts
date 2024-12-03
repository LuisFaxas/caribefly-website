import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
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
  ) => Promise<{ success: boolean; error?: string }>
  updateCharterPrices: (
    data: CharterUpdate
  ) => Promise<{ success: boolean; error?: string }>
  globalProfit: GlobalProfit
  updateGlobalProfit: (
    profit: GlobalProfit
  ) => Promise<{ success: boolean; error?: string }>
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

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const charterRef = doc(db, 'charters', charterId)
        const charterDoc = await getDoc(charterRef)

        if (!charterDoc.exists()) {
          // Initialize with default data if no document exists
          const defaultData: CharterData = {
            id: charterId,
            name: 'New Charter',
            destinations: [],
            globalProfit: { rt: 20, ow: 20 },
          }
          await setDoc(charterRef, defaultData)
          setData(defaultData)
          setGlobalProfit(defaultData.globalProfit)
        } else {
          const charterData = charterDoc.data() as CharterData
          setData(charterData)
          setGlobalProfit(charterData.globalProfit)

          // Set initial destination if available
          if (charterData.destinations.length > 0) {
            setSelectedDestination(charterData.destinations[0].destination)
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch charter data')
        )
        // toast.error('Failed to load charter data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [charterId])

  // Subscribe to charter updates
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'charters', charterId),
      (doc) => {
        if (doc.exists()) {
          console.log('[usePriceManagement] Raw charter data:', doc.data())

          // Transform the data to match the expected CharterData structure
          const rawData = doc.data()
          const transformedData: CharterData = {
            id: doc.id,
            name: rawData.name || '',
            destinations:
              rawData.destinations?.map((dest: any) => ({
                destination: dest.destination || '',
                flightDays: dest.flightDays || [],
                flightTimes:
                  dest.flightTimes?.map((time: any) => ({
                    ida: time.ida || '',
                    regreso: time.regreso || '',
                  })) || [],
                periods:
                  dest.periods?.map((period: any) => ({
                    label: period.label || '',
                    startDate: period.startDate || '',
                    endDate: period.endDate || '',
                    rt: Number(period.rt) || 0,
                    ow: Number(period.ow) || 0,
                  })) || [],
                baggageInfo: dest.baggageInfo || [],
                additionalInfo: dest.additionalInfo || [],
              })) || [],
            globalProfit: {
              rt: Number(rawData.globalProfit?.rt) || 20,
              ow: Number(rawData.globalProfit?.ow) || 20,
            },
          }

          console.log(
            '[usePriceManagement] Transformed charter data:',
            transformedData
          )

          setData(transformedData)
          setGlobalProfit(transformedData.globalProfit)

          // Auto-select first destination if none selected
          if (
            !selectedDestination &&
            transformedData.destinations?.length > 0
          ) {
            setSelectedDestination(transformedData.destinations[0].destination)
          }
        } else {
          console.log('[usePriceManagement] No charter document found')
          setData(null)
        }
      },
      (err) => {
        console.error('[usePriceManagement] Error fetching charter data:', err)
        setError(err as Error)
      }
    )

    return () => unsubscribe()
  }, [charterId, selectedDestination])

  // Validation functions
  const validateDestination = (
    destination: DestinationData
  ): ValidationError[] => {
    const errors: ValidationError[] = []

    // Validate destination name
    if (!destination.destination) {
      errors.push({
        field: 'destination',
        message: 'Destination name is required',
      })
    }

    // Validate flight days and times
    if (!destination.flightDays?.length || !destination.flightTimes?.length) {
      errors.push({
        field: 'flightSchedule',
        message: 'At least one flight schedule is required',
      })
    } else {
      // Validate each flight time
      destination.flightTimes.forEach((time, index) => {
        if (!time.ida || !time.regreso) {
          errors.push({
            field: `flightTime_${index}`,
            message: `Flight time ${index + 1} must have both departure and return times`,
          })
        }
      })
    }

    // Validate periods
    if (!destination.periods?.length) {
      errors.push({
        field: 'periods',
        message: 'At least one price period is required',
      })
    } else {
      // Validate each period
      destination.periods.forEach((period, index) => {
        if (!period.label) {
          errors.push({
            field: `period_${index}_label`,
            message: `Period ${index + 1} must have a label`,
          })
        }
        if (!period.startDate || !period.endDate) {
          errors.push({
            field: `period_${index}_dates`,
            message: `Period ${index + 1} must have start and end dates`,
          })
        }
        if (period.rt < 0 || period.ow < 0) {
          errors.push({
            field: `period_${index}_prices`,
            message: `Period ${index + 1} must have valid prices`,
          })
        }
      })
    }

    return errors
  }

  const updateDestination = async (
    destinationIndex: number,
    updates: Partial<DestinationData>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!data) {
        throw new Error('No charter data available')
      }

      const currentDestination = data.destinations[destinationIndex]
      if (!currentDestination) {
        throw new Error('Invalid destination index')
      }

      // Create updated destination data
      const updatedDestination: DestinationData = {
        ...currentDestination,
        ...updates,
      }

      // Validate the updated destination
      const validationErrors = validateDestination(updatedDestination)
      if (validationErrors.length > 0) {
        setValidationErrors(validationErrors)
        return {
          success: false,
          error: 'Validation failed. Please check the form for errors.',
        }
      }

      // Update the destination in Firestore
      const batch = writeBatch(db)
      const charterRef = doc(db, 'charters', charterId)

      const updatedDestinations = [...data.destinations]
      updatedDestinations[destinationIndex] = updatedDestination

      batch.update(charterRef, {
        destinations: updatedDestinations,
      })

      await batch.commit()
      return { success: true }
    } catch (error) {
      console.error('[usePriceManagement] Error updating destination:', error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  const updateCharterPrices = async (
    updates: CharterUpdate
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!data) {
        throw new Error('No charter data available')
      }

      // Validate price updates
      if (updates.globalProfit) {
        if (updates.globalProfit.rt < 0 || updates.globalProfit.ow < 0) {
          return {
            success: false,
            error: 'Global profit percentages must be positive numbers',
          }
        }
      }

      // Update prices in Firestore
      const batch = writeBatch(db)
      const charterRef = doc(db, 'charters', charterId)

      if (updates.globalProfit) {
        batch.update(charterRef, {
          globalProfit: updates.globalProfit,
        })
      }

      await batch.commit()
      return { success: true }
    } catch (error) {
      console.error(
        '[usePriceManagement] Error updating charter prices:',
        error
      )
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  const updateGlobalProfit = async (
    profit: GlobalProfit
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (profit.rt < 0 || profit.ow < 0) {
        return {
          success: false,
          error: 'Global profit percentages must be positive numbers',
        }
      }

      const batch = writeBatch(db)
      const charterRef = doc(db, 'charters', charterId)

      batch.update(charterRef, {
        globalProfit: profit,
      })

      await batch.commit()
      setGlobalProfit(profit)
      return { success: true }
    } catch (error) {
      console.error('[usePriceManagement] Error updating global profit:', error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }
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
