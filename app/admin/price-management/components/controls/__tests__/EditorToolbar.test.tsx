import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import EditorToolbar from '../EditorToolbar'
import { CharterData } from '@/app/types/charter'

// Mock data
const mockCharters: CharterData[] = [
  {
    id: '1',
    destinations: [
      { destination: 'MIA-HAV', prices: [] },
      { destination: 'MIA-VRA', prices: [] },
    ],
  },
]

const defaultProps = {
  charters: mockCharters,
  globalProfit: { percentage: 10, fixed: 0 },
  onCharterUpdate: vi.fn(),
  onGlobalProfitChange: vi.fn(),
  onDownload: vi.fn(),
  onSave: vi.fn(),
  onLoad: vi.fn(),
  onAgencyLogoChange: vi.fn(),
  onPromotionalImageChange: vi.fn(),
  selectedDestination: 'MIA-HAV',
  onDestinationChange: vi.fn(),
  selectedCharterIndex: 0,
  onSelectCharter: vi.fn(),
}

describe('EditorToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<EditorToolbar {...defaultProps} />)
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
  })

  it('displays correct destination options', () => {
    render(<EditorToolbar {...defaultProps} />)
    const select = screen.getByLabelText('Destination')
    expect(select).toHaveValue('MIA-HAV')
  })

  it('handles destination change', () => {
    render(<EditorToolbar {...defaultProps} />)
    const select = screen.getByLabelText('Destination')
    fireEvent.change(select, { target: { value: 'MIA-VRA' } })
    expect(defaultProps.onDestinationChange).toHaveBeenCalledWith('MIA-VRA')
  })

  it('handles save button click', () => {
    render(<EditorToolbar {...defaultProps} />)
    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)
    expect(defaultProps.onSave).toHaveBeenCalled()
  })

  it('handles download button click', () => {
    render(<EditorToolbar {...defaultProps} />)
    const downloadButton = screen.getByRole('button', { name: /download/i })
    fireEvent.click(downloadButton)
    expect(defaultProps.onDownload).toHaveBeenCalled()
  })

  it('handles global profit changes', async () => {
    render(<EditorToolbar {...defaultProps} />)
    const profitInput = screen.getByLabelText('Global Profit %')
    fireEvent.change(profitInput, { target: { value: '20' } })
    await waitFor(() => {
      expect(defaultProps.onGlobalProfitChange).toHaveBeenCalledWith({
        percentage: 20,
        fixed: 0,
      })
    })
  })

  it('handles file uploads for agency logo', async () => {
    render(<EditorToolbar {...defaultProps} />)
    const fileInput = screen.getByLabelText('Agency Logo')
    const file = new File(['logo'], 'logo.png', { type: 'image/png' })

    Object.defineProperty(fileInput, 'files', {
      value: [file],
    })

    fireEvent.change(fileInput)

    await waitFor(() => {
      expect(defaultProps.onAgencyLogoChange).toHaveBeenCalled()
    })
  })

  it('handles file uploads for promotional image', async () => {
    render(<EditorToolbar {...defaultProps} />)
    const fileInput = screen.getByLabelText('Promotional Image')
    const file = new File(['promo'], 'promo.jpg', { type: 'image/jpeg' })

    Object.defineProperty(fileInput, 'files', {
      value: [file],
    })

    fireEvent.change(fileInput)

    await waitFor(() => {
      expect(defaultProps.onPromotionalImageChange).toHaveBeenCalled()
    })
  })

  it('validates file types for image uploads', async () => {
    render(<EditorToolbar {...defaultProps} />)
    const fileInput = screen.getByLabelText('Agency Logo')
    const invalidFile = new File(['invalid'], 'invalid.txt', {
      type: 'text/plain',
    })

    Object.defineProperty(fileInput, 'files', {
      value: [invalidFile],
    })

    fireEvent.change(fileInput)

    expect(
      screen.getByText(/Only image files are allowed/i)
    ).toBeInTheDocument()
  })
})
