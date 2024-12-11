// src/utils/storage.ts

import type { CharterData, GlobalProfit } from '@/types'

export interface StorageData {
  charters: CharterData[]
  globalProfit: GlobalProfit
  agencyLogo?: string
  promotionalImage?: string
  lastUpdated: string
  selectedDestination: string
  selectedCharterIndex: number
}

const STORAGE_KEY = 'charterPriceData'

// Utility functions
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const calculatePrice = (
  basePrice: number,
  type: keyof GlobalProfit,
  globalProfit: GlobalProfit,
  overrideProfit?: Partial<GlobalProfit>
): number => {
  const profit = overrideProfit?.[type] ?? globalProfit[type]
  return basePrice + profit
}

class StorageManager {
  private static instance: StorageManager
  private data: StorageData | null = null
  private initialized: boolean = false

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  isInitialized(): boolean {
    return this.initialized
  }

  async initialize(): Promise<void> {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY)
      if (storedData) {
        this.data = JSON.parse(storedData)
        console.log('Data loaded from storage:', this.data)
      }
      this.initialized = true
    } catch (error) {
      console.error('Error initializing storage:', error)
      this.data = null
      this.initialized = true // Still mark as initialized even if there's an error
    }
  }

  async saveData(data: StorageData): Promise<boolean> {
    try {
      if (!this.initialized) {
        console.warn('Attempting to save before initialization')
        return false
      }

      this.data = data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      console.log('Data saved successfully:', data)
      return true
    } catch (error) {
      console.error('Error saving data:', error)
      return false
    }
  }

  getData(): StorageData | null {
    if (!this.initialized) {
      console.warn('Attempting to get data before initialization')
      return null
    }
    return this.data
  }

  clearData(): void {
    if (!this.initialized) {
      console.warn('Attempting to clear data before initialization')
      return
    }
    localStorage.removeItem(STORAGE_KEY)
    this.data = null
  }
}

export const storageManager = StorageManager.getInstance()
