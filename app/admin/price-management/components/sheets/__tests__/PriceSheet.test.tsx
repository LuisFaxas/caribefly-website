import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import PriceSheet from '../PriceSheet'
import { CharterData } from '@/app/types/charter'

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
  },
]

describe('PriceSheet', () => {
  const defaultProps = {
    charters: mockCharters,
    selectedDestination: 'MIA-HAV',
  }

  it('renders without crashing', () => {
    render(<PriceSheet {...defaultProps} />)
    expect(screen.getByTestId('price-sheet')).toBeInTheDocument()
  })

  it('displays correct destination', () => {
    render(<PriceSheet {...defaultProps} />)
    expect(screen.getByText('MIA-HAV')).toBeInTheDocument()
  })

  it('displays price periods correctly', () => {
    render(<PriceSheet {...defaultProps} />)
    expect(screen.getByText('High Season')).toBeInTheDocument()
    expect(screen.getByText('01/01/2024 - 03/31/2024')).toBeInTheDocument()
  })

  it('displays base and adjusted prices', () => {
    render(<PriceSheet {...defaultProps} />)
    expect(screen.getByText('$1,000')).toBeInTheDocument()
    expect(screen.getByText('$1,100')).toBeInTheDocument()
  })

  it('handles empty charter data gracefully', () => {
    render(<PriceSheet charters={[]} selectedDestination="MIA-HAV" />)
    expect(screen.getByText(/No price data available/i)).toBeInTheDocument()
  })

  it('handles non-existent destination gracefully', () => {
    render(<PriceSheet {...defaultProps} selectedDestination="INVALID" />)
    expect(screen.getByText(/No price data available/i)).toBeInTheDocument()
  })

  it('formats currency correctly', () => {
    render(<PriceSheet {...defaultProps} />)
    const prices = screen.getAllByText(/\$[\d,]+/)
    prices.forEach((price) => {
      expect(price.textContent).toMatch(/^\$\d{1,3}(,\d{3})*$/)
    })
  })

  it('displays price periods in chronological order', () => {
    const chartersWithMultiplePeriods: CharterData[] = [
      {
        id: '1',
        destinations: [
          {
            destination: 'MIA-HAV',
            prices: [
              {
                period: 'Low Season',
                dates: '04/01/2024 - 06/30/2024',
                basePrice: 800,
                adjustedPrice: 880,
              },
              {
                period: 'High Season',
                dates: '01/01/2024 - 03/31/2024',
                basePrice: 1000,
                adjustedPrice: 1100,
              },
            ],
          },
        ],
      },
    ]

    render(
      <PriceSheet
        charters={chartersWithMultiplePeriods}
        selectedDestination="MIA-HAV"
      />
    )
    const periods = screen.getAllByTestId('price-period')
    expect(periods[0]).toHaveTextContent('High Season')
    expect(periods[1]).toHaveTextContent('Low Season')
  })
})
