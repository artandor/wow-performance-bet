'use client'

import { useState } from 'react'
import PlayerSelector from './PlayerSelector'

interface BetParticipationFormProps {
  betId: string
  roster: string[]
  groupSize: number
  onPlaceBet: (betId: string, selectedGroup: string[]) => Promise<void>
}

export default function BetParticipationForm({
  betId,
  roster,
  groupSize,
  onPlaceBet,
}: BetParticipationFormProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (selectedPlayers.length !== groupSize) {
      setError(`You must select exactly ${groupSize} players`)
      return
    }

    setIsLoading(true)

    try {
      await onPlaceBet(betId, selectedPlayers)
      setSuccess(true)
      setSelectedPlayers([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet')
    } finally {
      setIsLoading(false)
    }
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
        <p className="text-sm text-red-600">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-600">Bet placed successfully!</p>
      )}

      <button
        type="submit"
        disabled={isLoading || selectedPlayers.length !== groupSize}
        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Placing Bet...' : 'Place Bet'}
      </button>
    </form>
  )
}
