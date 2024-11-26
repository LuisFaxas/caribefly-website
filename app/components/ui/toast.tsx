'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { NotificationType } from '@/types/charter'

export interface ToastProps {
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
      {message}
    </div>
  )
}

export default Toast
