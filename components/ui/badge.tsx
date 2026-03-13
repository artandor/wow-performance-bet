import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:    'bg-elevated text-bright border border-white/10',
        open:       'bg-goblin/20 text-goblin border border-goblin/30',
        closed:     'bg-gold/20 text-gold border border-gold/30',
        resolved:   'bg-neon-purple/20 text-neon-pink border border-neon-pink/20',
        destructive:'bg-table/20 text-orange-400 border border-table/30',
        neon:       'bg-neon-pink/15 text-neon-pink border border-neon-pink/25',
        outline:    'border border-white/20 text-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
