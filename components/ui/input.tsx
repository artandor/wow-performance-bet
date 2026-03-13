import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-white/15 bg-elevated px-3 py-1 text-sm text-bright shadow-sm transition-colors',
          'placeholder:text-muted/60',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:border-gold/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // datetime-local color fix
          '[color-scheme:dark]',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
