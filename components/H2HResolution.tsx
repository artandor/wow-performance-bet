'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Trophy, Swords } from 'lucide-react'
import { BetH2H } from '@/types'

interface H2HResolutionProps {
  bet: BetH2H
  onResolve: (winningSideIndex: 0 | 1) => Promise<void>
}

export default function H2HResolution({ bet, onResolve }: H2HResolutionProps) {
  const [isLoading, setIsLoading] = useState<0 | 1 | null>(null)
  const [error, setError] = useState('')

  if (bet.status === 'resolved') {
    const { participants, winningSideIndex, sides, goldAmount } = bet
    const sideACounts = participants.filter(p => p.sideIndex === 0).length
    const sideBCounts = participants.filter(p => p.sideIndex === 1).length
    const winnerParticipants = participants.filter(p => p.sideIndex === winningSideIndex)
    const potSize = goldAmount * participants.length
    const payout = winnerParticipants.length > 0 ? Math.floor(potSize / winnerParticipants.length) : 0

    return (
      <div className="rounded-xl border border-gold/20 bg-gold/5 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-bright">Resolved</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sides.map((side, i) => {
            const isWinner = i === winningSideIndex
            const count = i === 0 ? sideACounts : sideBCounts
            return (
              <div key={i} className={`rounded-lg border p-4 text-center ${isWinner ? 'border-gold/40 bg-gold/10' : 'border-white/10 bg-surface opacity-50'}`}>
                <p className={`font-semibold text-sm ${isWinner ? 'text-gold' : 'text-muted'}`}>{side}</p>
                <p className="text-xs text-muted mt-1">{count} bet{count !== 1 ? 's' : ''}</p>
                {isWinner && <p className="text-xs text-gold font-semibold mt-1">WINNER</p>}
              </div>
            )
          })}
        </div>

        {winnerParticipants.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs text-muted uppercase tracking-wider">Winners</p>
            {winnerParticipants.map(p => (
              <div key={p.playerId} className="flex items-center justify-between rounded-lg bg-gold/10 border border-gold/20 px-3 py-2 text-sm">
                <span className="text-gold font-medium">{p.playerName ?? p.playerId}</span>
                <span className="text-xs text-gold font-semibold">+{payout - goldAmount}g</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (bet.status !== 'closed') return null

  const handleResolve = async (sideIndex: 0 | 1) => {
    setError('')
    setIsLoading(sideIndex)
    try {
      await onResolve(sideIndex)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resolution failed')
    } finally {
      setIsLoading(null)
    }
  }

  const [sideA, sideB] = bet.sides

  return (
    <div className="rounded-xl border border-white/10 bg-surface p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Swords className="w-5 h-5 text-goblin" />
        <h3 className="font-semibold text-bright">Resolve H2H</h3>
      </div>
      <p className="text-sm text-muted">Which side won?</p>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          disabled={isLoading !== null}
          onClick={() => handleResolve(0)}
          className="bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 py-6"
        >
          {isLoading === 0 ? 'Resolving…' : sideA}
        </Button>
        <Button
          type="button"
          disabled={isLoading !== null}
          onClick={() => handleResolve(1)}
          className="bg-goblin/10 hover:bg-goblin/20 text-goblin border border-goblin/30 py-6"
        >
          {isLoading === 1 ? 'Resolving…' : sideB}
        </Button>
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
