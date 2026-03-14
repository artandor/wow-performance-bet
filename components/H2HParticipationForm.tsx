'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2, Swords } from 'lucide-react'
import { BetH2H } from '@/types'

interface H2HParticipationFormProps {
  bet: BetH2H
  onSubmit: (sideIndex: 0 | 1) => Promise<void>
  existingAnswer?: 0 | 1
}

export default function H2HParticipationForm({ bet, onSubmit, existingAnswer }: H2HParticipationFormProps) {
  const isUpdate = existingAnswer !== undefined
  const [isLoading, setIsLoading] = useState<0 | 1 | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handlePick = async (sideIndex: 0 | 1) => {
    setError('')
    setIsLoading(sideIndex)
    try {
      await onSubmit(sideIndex)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet')
    } finally {
      setIsLoading(null)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-goblin">
        <CheckCircle2 className="w-8 h-8" />
        <p className="font-semibold">{isUpdate ? 'Bet updated!' : 'Bet placed!'}</p>
      </div>
    )
  }

  const [sideA, sideB] = bet.sides
  const sideACount = bet.participants.filter(p => p.sideIndex === 0).length
  const sideBCount = bet.participants.filter(p => p.sideIndex === 1).length
  const total = sideACount + sideBCount

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted flex items-center gap-1.5">
        <Swords className="w-4 h-4 text-goblin" />
        {isUpdate ? 'Update your side:' : 'Pick your side:'}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={isLoading !== null}
          onClick={() => handlePick(0)}
          className={`group relative flex flex-col items-center gap-2 rounded-xl border bg-gold/5 hover:bg-gold/10 p-6 transition-all ${existingAnswer === 0 ? 'border-gold ring-1 ring-gold' : 'border-gold/30 hover:border-gold/60'}`}
        >
          <span className="text-base font-semibold text-gold text-center">{sideA}</span>
          {total > 0 && (
            <span className="text-xs text-muted">{sideACount} bet{sideACount !== 1 ? 's' : ''} · {total > 0 ? Math.round(sideACount / total * 100) : 0}%</span>
          )}
          {isLoading === 0 && <span className="text-xs text-muted mt-1">Placing…</span>}
        </button>

        <button
          type="button"
          disabled={isLoading !== null}
          onClick={() => handlePick(1)}
          className={`group relative flex flex-col items-center gap-2 rounded-xl border bg-table/5 hover:bg-table/10 p-6 transition-all ${existingAnswer === 1 ? 'border-table ring-1 ring-table' : 'border-table/30 hover:border-table/60'}`}
        >
          <span className="text-base font-semibold text-table text-center">{sideB}</span>
          {total > 0 && (
            <span className="text-xs text-muted">{sideBCount} bet{sideBCount !== 1 ? 's' : ''} · {total > 0 ? Math.round(sideBCount / total * 100) : 0}%</span>
          )}
          {isLoading === 1 && <span className="text-xs text-muted mt-1">Placing…</span>}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800/50 px-3 py-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
