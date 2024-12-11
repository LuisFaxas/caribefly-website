// src/components/ui/select.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.ComponentPropsWithoutRef<'select'> {
  className?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-2 py-1 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground appearance-none',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)

Select.displayName = 'Select'

export default Select
