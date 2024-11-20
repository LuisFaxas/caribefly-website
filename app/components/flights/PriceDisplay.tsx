'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebaseConfig'
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore'
import type { CharterData, GlobalProfit } from '@/types/charter'
import { DESTINATIONS } from '@/constants/defaults'
import PriceSheet from '@/app/admin/charter-editor/components/PriceSheet'

interface PriceDisplayProps {
  destinationCode: string
}

export default function PriceDisplay({ destinationCode }: PriceDisplayProps) {
  const [charters, setCharters] = useState<CharterData[]>([])
  const [globalProfit, setGlobalProfit] = useState<GlobalProfit>({
    percentage: 0,
    fixedAmount: 0,
    usePercentage: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Subscribe to charter data changes
    const unsubscribe = onSnapshot(
      collection(db, 'charters'),
      (snapshot) => {
        const charterData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CharterData[]

        setCharters(charterData)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching charters:', error)
        setLoading(false)
      }
    )

    // Fetch global profit settings
    const fetchGlobalProfit = async () => {
      try {
        const profitDoc = await getDoc(doc(db, 'settings', 'globalProfit'))
        if (profitDoc.exists()) {
          setGlobalProfit(profitDoc.data() as GlobalProfit)
        }
      } catch (error) {
        console.error('Error fetching global profit:', error)
      }
    }

    fetchGlobalProfit()
    return () => unsubscribe()
  }, [])

  const selectedDestInfo = DESTINATIONS.find((d) => d.code === destinationCode)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-gray-600">Loading prices...</div>
      </div>
    )
  }

  if (!selectedDestInfo) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-red-600">Destination not found</div>
      </div>
    )
  }

  return (
    <div className="price-display">
      <PriceSheet
        charters={charters}
        globalProfit={globalProfit}
        selectedDestination={destinationCode}
        onUpdate={() => {}} // No-op since this is read-only
        readOnly={true}
      />
    </div>
  )
}
