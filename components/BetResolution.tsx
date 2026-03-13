'use client'

import { useState } from 'react'
import { Bet, BetGroupDps, LegacyBet } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Trophy, AlertCircle, CheckCircle2, Crown } from 'lucide-react'

interface BetResolutionProps {
  bet: Bet
  onResolve: (winningGroup: string[]) => Promise<void>
}

export default function BetResolution({ bet, onResolve }: BetResolutionProps) {
  const [selectedGroup, setSelectedGroup] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // BetResolution only handles group-dps/legacy bets
  const groupBet = bet as BetGroupDps | LegacyBet

  const uniqueGroups = Array.from(
    new Set(groupBet.participants.map((p) => (p as { selectedGroup?: string[] }).selectedGroup?.sort().join(',') ?? '').filter(Boolean))
  ).map((key) => key.split(','))

  const handleResolve = async () => {
    if (!selectedGroup) { setError('Select a winning group'); return }
    setIsLoading(true); setError(''); setSuccess(false)
    try {
      await onResolve(selectedGroup)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally { setIsLoading(false) }
  }

  const winningGroup = groupBet.winningGroup
  const winners = winningGroup
    ? groupBet.participants.filter((p) => (p as { selectedGroup?: string[] }).selectedGroup?.sort().join(',') === winningGroup.sort().join(','))
    : []
  const losers = winningGroup
    ? groupBet.participants.filter((p) => (p as { selectedGroup?: string[] }).selectedGroup?.sort().join(',') !== winningGroup.sort().join(','))
    : []
  const potSize = bet.goldAmount * bet.participants.length
  const payoutPerWinner = winners.length > 0 ? potSize / winners.length : 0

  if (bet.status === 'resolved') {
    return (
      <Card className="border-goblin/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-goblin">
            <Trophy className="w-5 h-5" />
            Bet Resolved
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-2">Winning Group</p>
            <div className="flex flex-wrap gap-2">
              {winningGroup?.map((player) => (
                <span key={player} className="flex items-center gap-1 px-3 py-1 bg-goblin/15 text-goblin border border-goblin/25 rounded-full text-sm font-semibold">
                  <Crown className="w-3 h-3" />
                  {player}
                </span>
              ))}
            </div>
          </div>

          {winners.length > 0 ? (
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-2">
                Winners ({winners.length})
              </p>
              <div className="space-y-2">
                {winners.map((w) => (
                  <div key={w.playerId} className="flex justify-between items-center p-3 rounded-lg bg-goblin/10 border border-goblin/20">
                    <span className="text-sm font-medium text-bright">{w.playerName ?? w.playerId}</span>
                    <span className="text-sm font-bold text-goblin">+{Math.floor(payoutPerWinner).toLocaleString()} or</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-gold/10 border border-gold/20 text-sm text-gold">
              No winners &mdash; no one selected this group.
            </div>
          )}

          {losers.length > 0 && (
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-2">
                Losers ({losers.length})
              </p>
              <div className="space-y-2">
                {losers.map((l) => (
                  <div key={l.playerId} className="flex justify-between items-center p-3 rounded-lg bg-table/10 border border-table/20">
                    <span className="text-sm text-bright">{l.playerName ?? l.playerId}</span>
                    <span className="text-sm font-bold text-orange-400">-{bet.goldAmount.toLocaleString()} or</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (bet.status === 'open') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted">
            Resolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted">The bet must be closed before it can be resolved.</p>
        </CardContent>
      </Card>
    )
  }

  if (uniqueGroups.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Resolve Bet</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted">No participants &mdash; cannot resolve.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gold/15">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-gold" />
          Resolve Bet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted">Select the winning group:</p>

        <div className="space-y-2">
          {uniqueGroups.map((group, index) => {
            const groupKey = group.sort().join(',')
            const isSelected = selectedGroup?.sort().join(',') === groupKey
            const bettorsCount = groupBet.participants.filter(
              (p) => (p as { selectedGroup?: string[] }).selectedGroup?.sort().join(',') === groupKey
            ).length

            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedGroup(group)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border transition-all',
                  isSelected
                    ? 'border-gold/50 bg-gold/10 shadow-gold/10 shadow-sm'
                    : 'border-white/10 bg-elevated/50 hover:border-white/20 hover:bg-elevated'
                )}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-bright">Group {index + 1}</span>
                  <span className="text-xs text-muted">{bettorsCount} bet{bettorsCount > 1 ? 's' : ''}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.map((player) => (
                    <span
                      key={player}
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium border',
                        isSelected
                          ? 'bg-gold/20 text-gold border-gold/30'
                          : 'bg-elevated text-muted border-white/10'
                      )}
                    >
                      {player}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-orange-400">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </p>
        )}
        {success && (
          <p className="flex items-center gap-1.5 text-xs text-goblin">
            <CheckCircle2 className="w-3.5 h-3.5" /> Bet resolved!
          </p>
        )}

        <Button
          onClick={handleResolve}
          disabled={!selectedGroup || isLoading}
          variant="success"
          className="w-full gap-2"
        >
          <Trophy className="w-4 h-4" />
          {isLoading ? 'Resolving...' : 'Confirm result'}
        </Button>
      </CardContent>
    </Card>
  )
}
