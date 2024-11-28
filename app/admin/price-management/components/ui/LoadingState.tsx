'use client'

import React from 'react'
import { Card, CardContent } from '@/app/components/ui'

interface LoadingStateProps {
  type?: 'editor' | 'sheet'
}

const LoadingState: React.FC<LoadingStateProps> = ({ type = 'editor' }) => {
  if (type === 'sheet') {
    return (
      <div className="w-[800px] bg-gradient-to-b from-gray-800 to-gray-900 p-4 text-white animate-pulse">
        <div className="h-20 bg-gray-700 rounded mb-4" />
        <div className="h-40 bg-gray-700 rounded mb-4" />
        <div className="h-60 bg-gray-700 rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoadingState
