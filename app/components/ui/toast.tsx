'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { NotificationType } from '@/types/charter'

interface ToastProps {
  type: NotificationType
  message: string
  onClose?: () => void
}

const Toast = ({ type, message, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const baseClasses =
    'fixed top-4 right-4 p-4 rounded-md shadow-lg transition-opacity duration-300'
  const typeClasses = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-white',
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        baseClasses,
        typeClasses[type],
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      role="alert"
    >
      <div className="flex items-center gap-2">
        {type === 'success' && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {type === 'error' && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        {type === 'warning' && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )}
        <span>{message}</span>
      </div>
    </div>
  )
}

export default Toast
