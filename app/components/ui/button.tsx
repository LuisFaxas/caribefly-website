'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive'
  as?: 'button' | 'span'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', as = 'button', children, ...props },
    ref
  ) => {
    const Component = as

    const baseClasses =
      'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    }

    return (
      <Component
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Button.displayName = 'Button'

export { Button }
