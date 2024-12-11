// src/components/ui/textarea.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, onChange, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event)
    }
  }

  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 whitespace-pre-wrap',
        className
      )}
      ref={ref}
      onChange={handleChange}
      style={{
        resize: 'vertical',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        ...props.style,
      }}
      spellCheck="false"
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'

export { Textarea }
