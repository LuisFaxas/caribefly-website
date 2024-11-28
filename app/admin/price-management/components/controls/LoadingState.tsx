import React from 'react'

interface LoadingStateProps {
  type?: 'default' | 'sheet' | 'editor'
}

export default function LoadingState({ type = 'default' }: LoadingStateProps) {
  const getLoadingContent = () => {
    switch (type) {
      case 'sheet':
        return (
          <div className="bg-gray-800 rounded-lg p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        )
      case 'editor':
        return (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-8 bg-gray-700 rounded"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-gray-400">Loading...</p>
          </div>
        )
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      {getLoadingContent()}
    </div>
  )
}
