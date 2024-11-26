import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PriceEditor from '../PriceEditor'
import { CharterData } from '@/app/types/charter'

// Mock child components
jest.mock('../ui/TimeSelector', () => {
  return function MockTimeSelector({
    value,
    onChange,
  }: {
    value: string
    onChange: (value: string) => void
  }) {
    return (
      <input
        data-testid="time-selector"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }
})

jest.mock('./BaggageInfoEditor', () => {
  return function MockBaggageInfoEditor() {
    return <div data-testid="baggage-info-editor" />
  }
})

jest.mock('./InfoEditor', () => {
  return function MockInfoEditor() {
    return <div data-testid="info-editor" />
  }
})

const mockCharters: CharterData[] = [
  {
    id: '1',
    destinations: [
      {
        destination: 'MIA-HAV',
        prices: [
          {
            period: 'High Season',
            dates: '01/01/2024 - 03/31/2024',
            basePrice: 1000,
            adjustedPrice: 1100,
          },
        ],
      },
    ],
    flightDays: ['Monday', 'Wednesday', 'Friday'],
    flightTimes: ['09:00', '14:00'],
    baggageInfo: {
      carryOn: { weight: '10kg', dimensions: '22x14x9' },
      checked: { weight: '23kg', dimensions: '62x30x40' },
    },
    additionalInfo: ['Meals included', 'Free WiFi'],
  },
]

describe('PriceEditor', () => {
  const defaultProps = {
    charters: mockCharters,
    selectedDestination: 'MIA-HAV',
    selectedCharterIndex: 0,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<PriceEditor {...defaultProps} />)
    expect(screen.getByTestId('price-editor')).toBeInTheDocument()
  })

  it('displays flight schedule section', () => {
    render(<PriceEditor {...defaultProps} />)
    expect(screen.getByText(/Flight Schedule/i)).toBeInTheDocument()
    defaultProps.charters[0].flightDays.forEach((day) => {
      expect(screen.getByDisplayValue(day)).toBeInTheDocument()
    })
  })

  it('handles adding new flight time', async () => {
    render(<PriceEditor {...defaultProps} />)
    const addButton = screen.getByRole('button', { name: /Add Flight Time/i })
    await userEvent.click(addButton)
    const timeSelectors = screen.getAllByTestId('time-selector')
    expect(timeSelectors).toHaveLength(
      defaultProps.charters[0].flightTimes.length + 1
    )
  })

  it('handles removing flight time', async () => {
    render(<PriceEditor {...defaultProps} />)
    const removeButtons = screen.getAllByRole('button', {
      name: /Remove Time/i,
    })
    await userEvent.click(removeButtons[0])
    const timeSelectors = screen.getAllByTestId('time-selector')
    expect(timeSelectors).toHaveLength(
      defaultProps.charters[0].flightTimes.length - 1
    )
  })

  it('displays pricing section', () => {
    render(<PriceEditor {...defaultProps} />)
    expect(screen.getByText(/Pricing/i)).toBeInTheDocument()
    const priceInputs = screen.getAllByRole('spinbutton')
    expect(priceInputs.length).toBeGreaterThan(0)
  })

  it('handles price period changes', async () => {
    render(<PriceEditor {...defaultProps} />)
    const periodInput = screen.getByDisplayValue('High Season')
    await userEvent.clear(periodInput)
    await userEvent.type(periodInput, 'Peak Season')
    expect(periodInput).toHaveValue('Peak Season')
  })

  it('handles base price changes', async () => {
    render(<PriceEditor {...defaultProps} />)
    const basePriceInput = screen.getByDisplayValue('1000')
    await userEvent.clear(basePriceInput)
    await userEvent.type(basePriceInput, '1200')
    expect(basePriceInput).toHaveValue('1200')
  })

  it('renders baggage info editor', () => {
    render(<PriceEditor {...defaultProps} />)
    expect(screen.getByTestId('baggage-info-editor')).toBeInTheDocument()
  })

  it('renders additional info editor', () => {
    render(<PriceEditor {...defaultProps} />)
    expect(screen.getByTestId('info-editor')).toBeInTheDocument()
  })

  it('handles adding new price period', async () => {
    render(<PriceEditor {...defaultProps} />)
    const addButton = screen.getByRole('button', { name: /Add Price Period/i })
    await userEvent.click(addButton)
    const periodInputs = screen.getAllByPlaceholderText(/Period/i)
    expect(periodInputs.length).toBe(2)
  })

  it('handles removing price period', async () => {
    render(<PriceEditor {...defaultProps} />)
    const removeButton = screen.getByRole('button', { name: /Remove Period/i })
    await userEvent.click(removeButton)
    const periodInputs = screen.queryAllByPlaceholderText(/Period/i)
    expect(periodInputs.length).toBe(0)
  })

  // Add error handling tests
  it('handles invalid date format gracefully', async () => {
    render(<PriceEditor {...defaultProps} />)
    const dateInput = screen.getByDisplayValue('01/01/2024 - 03/31/2024')
    await userEvent.clear(dateInput)
    await userEvent.type(dateInput, 'invalid-date')
    expect(screen.getByText(/Invalid date format/i)).toBeInTheDocument()
  })

  it('validates price inputs', async () => {
    render(<PriceEditor {...defaultProps} />)
    const priceInput = screen.getByDisplayValue('1000')
    await userEvent.clear(priceInput)
    await userEvent.type(priceInput, '-100')
    expect(screen.getByText(/Price must be positive/i)).toBeInTheDocument()
  })
})
