'use client'

import { BetKind } from '@/types'
import { Swords, HelpCircle, Users } from 'lucide-react'

interface BetKindSelectorProps {
  onSelect: (kind: BetKind) => void
}

const kinds: { kind: BetKind; icon: React.ReactNode; label: string; description: string }[] = [
  {
    kind: 'group-dps',
    icon: <Users className="w-8 h-8 text-gold" />,
    label: 'Group DPS',
    description: 'Pick a group of raiders — the best-performing group wins the pot.',
  },
  {
    kind: 'prediction',
    icon: <HelpCircle className="w-8 h-8 text-neon" />,
    label: 'Prediction',
    description: 'Guess a number, vote yes/no, or pick from options. Closest answer wins.',
  },
  {
    kind: 'h2h',
    icon: <Swords className="w-8 h-8 text-goblin" />,
    label: 'Head-to-Head',
    description: 'Two sides, one winner. Pick a side and let the raid decide.',
  },
]

export default function BetKindSelector({ onSelect }: BetKindSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Choose the type of bet you want to create:</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {kinds.map(({ kind, icon, label, description }) => (
          <button
            key={kind}
            type="button"
            onClick={() => onSelect(kind)}
            className="group flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-surface hover:border-gold/50 hover:bg-elevated p-6 text-center transition-all duration-200"
          >
            <div className="rounded-full bg-night p-3 ring-1 ring-white/10 group-hover:ring-gold/30 transition-all">
              {icon}
            </div>
            <div>
              <p className="font-semibold text-bright text-sm mb-1">{label}</p>
              <p className="text-xs text-muted leading-relaxed">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
