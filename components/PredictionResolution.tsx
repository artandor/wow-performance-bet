'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Trophy } from 'lucide-react'
import { BetPrediction } from '@/types'

interface PredictionResolutionProps {
  bet: BetPrediction
  onResolve: (realAnswer: string) => Promise<void>
}

export default function PredictionResolution({ bet, onResolve }: PredictionResolutionProps) {
  const [realAnswer, setRealAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (bet.status === 'resolved') {
    const { participants, winnerIds = [], realAnswer: resolvedAnswer, goldAmount } = bet
    const potSize = goldAmount * participants.length
    const winnerCount = winnerIds.length
    const payout = winnerCount > 0 ? Math.floor(potSize / winnerCount) : 0

    return (
      <div className="rounded-xl border border-gold/20 bg-gold/5 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-bright">Resolved</h3>
        </div>
        <p className="text-sm text-muted">
          Real answer: <span className="text-bright font-semibold">{resolvedAnswer}{bet.unit ? ` ${bet.unit}` : ''}</span>
        </p>
        <div className="space-y-1.5">
          {participants.map(p => {
            const isWinner = winnerIds.includes(p.playerId)
            return (
              <div key={p.playerId} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${isWinner ? 'bg-gold/10 border border-gold/20' : 'bg-surface/50'}`}>
                <span className={isWinner ? 'text-gold font-medium' : 'text-muted'}>{p.playerName ?? p.playerId}</span>
                <span className="text-xs text-muted">Answered: {p.answer}</span>
                {isWinner && <span className="text-xs text-gold font-semibold">+{payout - goldAmount}g</span>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (bet.status !== 'closed') return null

  const handleResolve = async (answer: string) => {
    setError('')
    if (!answer.trim()) { setError('Real answer is required'); return }
    setIsLoading(true)
    try {
      await onResolve(answer.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resolution failed')
    } finally {
      setIsLoading(false)
    }
  }

  const { answerType, line, unit, choices } = bet

  return (
    <div className="rounded-xl border border-white/10 bg-surface p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-gold" />
        <h3 className="font-semibold text-bright">Resolve Bet</h3>
      </div>

      {answerType === 'binary' || answerType === 'multiple-choice' ? (
        <div className="space-y-2">
          <p className="text-sm text-muted">What was the correct answer?</p>
          <div className="flex flex-wrap gap-2">
            {(answerType === 'binary' ? ['Yes', 'No'] : (choices ?? [])).map(opt => (
              <Button
                key={opt}
                type="button"
                disabled={isLoading}
                onClick={() => handleResolve(opt)}
                className="bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30"
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>
      ) : answerType === 'over-under' ? (
        <div className="space-y-2">
          {line !== undefined && (
            <p className="text-sm text-muted">Line was: <span className="text-bright font-semibold">{line}{unit ? ` ${unit}` : ''}</span></p>
          )}
          <p className="text-sm text-muted">What happened?</p>
          <div className="flex gap-2">
            <Button type="button" disabled={isLoading} onClick={() => handleResolve('over')} className="bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30">Over</Button>
            <Button type="button" disabled={isLoading} onClick={() => handleResolve('under')} className="bg-surface hover:bg-elevated text-muted border border-white/10">Under</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="real-answer-number">
            What was the actual result?{unit ? ` (${unit})` : ''}
          </Label>
          <div className="flex gap-2">
            <Input
              id="real-answer-number"
              type="number"
              value={realAnswer}
              onChange={e => setRealAnswer(e.target.value)}
              placeholder="e.g. 4"
              className="max-w-[140px]"
            />
            <Button
              type="button"
              disabled={isLoading || !realAnswer.trim()}
              onClick={() => handleResolve(realAnswer)}
              className="bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30"
            >
              {isLoading ? 'Resolving…' : 'Resolve'}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800/50 px-3 py-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
