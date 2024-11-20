// src/components/ui/Toast.tsx

import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa'

interface ToastProps {
  type: 'success' | 'error' | 'warning'
  message: string
  onClose: () => void
  duration?: number
}

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck className="h-4 w-4" />
      case 'error':
        return <FaTimes className="h-4 w-4" />
      case 'warning':
        return <FaExclamationTriangle className="h-4 w-4" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-800 border-green-500'
      case 'error':
        return 'bg-red-800 border-red-500'
      case 'warning':
        return 'bg-yellow-800 border-yellow-500'
    }
  }

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-2',
        'border text-white shadow-lg transition-all duration-300',
        'animate-in slide-in-from-top-5',
        getStyles()
      )}
      role="alert"
    >
      <span className="flex items-center justify-center">{getIcon()}</span>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-white/80 hover:text-white focus:outline-none"
        aria-label="Cerrar notificación"
      >
        <FaTimes className="h-3 w-3" />
      </button>
    </div>
  )
}

export default Toast
