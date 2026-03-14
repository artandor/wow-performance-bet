'use client'

import { useState } from 'react'
import PlayerSelector from './PlayerSelector'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2, Coins } from 'lucide-react'

interface BetParticipationFormProps {
  betId: string
  roster: string[]
  groupSize: number
  onPlaceBet: (betId: string, selectedGroup: string[]) => Promise<void>
  existingAnswer?: string[]
}

export default function BetParticipationForm({
  betId,
  roster,
  groupSize,
  onPlaceBet,
  existingAnswer,
}: BetParticipationFormProps) {
  const isUpdate = !!existingAnswer
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(existingAnswer ?? [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess(false)

    if (selectedPlayers.length !== groupSize) {
      setError(`Select exactly ${groupSize} player${groupSize > 1 ? 's' : ''}`)
      return
    }

    setIsLoading(true)
    try {
      await onPlaceBet(betId, selectedPlayers)
      setSuccess(true)
      setSelectedPlayers([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally { setIsLoading(false) }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-goblin">
        <CheckCircle2 className="w-8 h-8" />
        <p className="font-semibold">{isUpdate ? 'Bet updated!' : 'Bet placed!'}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PlayerSelector
        roster={roster}
        selectedPlayers={selectedPlayers}
        onSelectionChange={setSelectedPlayers}
        maxPlayers={groupSize}
      />

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-orange-400">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading || selectedPlayers.length !== groupSize}
        className="w-full gap-2"
        variant="success"
      >
        <Coins className="w-4 h-4" />
        {isLoading ? 'Placing bet...' : isUpdate ? 'Update Bet' : 'Place Bet'}
      </Button>
    </form>
  )
}
