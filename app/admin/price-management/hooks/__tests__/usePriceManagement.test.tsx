import { renderHook, act } from '@testing-library/react'
import { usePriceManagement } from '../usePriceManagement'
import { charterOperations } from '@/lib/firestore-utils'
import { onSnapshot } from 'firebase/firestore'

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  onSnapshot: jest.fn(),
  doc: jest.fn(),
}))

// Mock firestore-utils
jest.mock('@/lib/firestore-utils', () => ({
  charterOperations: {
    updateDestination: jest.fn(),
    updateCharterPrices: jest.fn(),
  },
}))

describe('usePriceManagement', () => {
  const mockCharterId = 'test-charter-id'
  const mockCharterData = {
    id: mockCharterId,
    name: 'Test Charter',
    destinations: [
      {
        destination: 'Test Destination',
        flightDays: ['Monday'],
        flightTimes: [{ ida: '10:00', regreso: '12:00' }],
        periods: [
          {
            rt: 100,
            ow: 50,
          },
        ],
      },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() =>
      usePriceManagement({ charterId: mockCharterId })
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should update data when snapshot changes', () => {
    // Mock the onSnapshot callback
    let snapshotCallback: any
    ;(onSnapshot as jest.Mock).mockImplementation((_, callback) => {
      snapshotCallback = callback
      return () => {}
    })

    const { result } = renderHook(() =>
      usePriceManagement({ charterId: mockCharterId })
    )

    // Simulate snapshot update
    act(() => {
      snapshotCallback({
        exists: () => true,
        data: () => mockCharterData,
      })
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toEqual(mockCharterData)
    expect(result.current.error).toBeNull()
  })

  it('should handle snapshot errors', () => {
    // Mock the onSnapshot callback with error
    let errorCallback: any
    ;(onSnapshot as jest.Mock).mockImplementation((_, __, errCallback) => {
      errorCallback = errCallback
      return () => {}
    })

    const { result } = renderHook(() =>
      usePriceManagement({ charterId: mockCharterId })
    )

    const mockError = new Error('Snapshot error')

    // Simulate error
    act(() => {
      errorCallback(mockError)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe(mockError)
  })

  it('should handle non-existent charter', () => {
    let snapshotCallback: any
    ;(onSnapshot as jest.Mock).mockImplementation((_, callback) => {
      snapshotCallback = callback
      return () => {}
    })

    const { result } = renderHook(() =>
      usePriceManagement({ charterId: mockCharterId })
    )

    // Simulate snapshot with non-existent document
    act(() => {
      snapshotCallback({
        exists: () => false,
        data: () => null,
      })
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toEqual(new Error('Charter not found'))
  })

  it('should handle destination updates', async () => {
    const { result } = renderHook(() =>
      usePriceManagement({ charterId: mockCharterId })
    )

    const mockDestination = {
      destination: 'New Destination',
      flightDays: ['Tuesday'],
      flightTimes: [{ ida: '11:00', regreso: '13:00' }],
    }

    // Mock successful update
    ;(charterOperations.updateDestination as jest.Mock).mockResolvedValueOnce(
      undefined
    )

    await act(async () => {
      await result.current.updateDestination(mockDestination)
    })

    expect(charterOperations.updateDestination).toHaveBeenCalledWith(
      mockCharterId,
      mockDestination
    )
  })

  it('should handle price updates', async () => {
    const { result } = renderHook(() =>
      usePriceManagement({ charterId: mockCharterId })
    )

    const mockPrices = {
      rt: 200,
      ow: 100,
    }

    // Mock successful update
    ;(charterOperations.updateCharterPrices as jest.Mock).mockResolvedValueOnce(
      undefined
    )

    await act(async () => {
      await result.current.updatePrices(mockPrices)
    })

    expect(charterOperations.updateCharterPrices).toHaveBeenCalledWith(
      mockCharterId,
      mockPrices
    )
  })

  it('should cleanup snapshot listener on unmount', () => {
    const mockUnsubscribe = jest.fn()
    ;(onSnapshot as jest.Mock).mockReturnValue(mockUnsubscribe)

    const { unmount } = renderHook(() =>
      usePriceManagement({ charterId: mockCharterId })
    )

    unmount()

    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})
