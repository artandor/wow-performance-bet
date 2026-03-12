'use client'

import { useState } from 'react'
import { Bet } from '@/types'

interface BetResolutionProps {
  bet: Bet
  onResolve: (winningGroup: string[]) => Promise<void>
}

export default function BetResolution({ bet, onResolve }: BetResolutionProps) {
  const [selectedGroup, setSelectedGroup] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Get unique groups from participants
  const uniqueGroups = Array.from(
    new Set(bet.participants.map((p) => p.selectedGroup.sort().join(',')))
  ).map((groupKey) => groupKey.split(','))

  const handleResolve = async () => {
    if (!selectedGroup) {
      setError('Please select a winning group')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      await onResolve(selectedGroup)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve bet')
    } finally {
      setIsLoading(false)
    }
  }

  const winners = bet.winningGroup
    ? bet.participants.filter((p) =>
        p.selectedGroup.sort().join(',') === bet.winningGroup?.sort().join(',')
      )
    : []

  const losers = bet.winningGroup
    ? bet.participants.filter((p) =>
        p.selectedGroup.sort().join(',') !== bet.winningGroup?.sort().join(',')
      )
    : []

  const potSize = bet.goldAmount * bet.participants.length
  const payoutPerWinner = winners.length > 0 ? potSize / winners.length : 0

  if (bet.status === 'resolved') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-600">Bet Resolved</h3>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Winning Group:</p>
            <div className="flex flex-wrap gap-2">
              {bet.winningGroup?.map((player) => (
                <span
                  key={player}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded font-medium"
                >
                  {player}
                </span>
              ))}
            </div>
          </div>

          {winners.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Winners ({winners.length}):
              </p>
              <div className="space-y-2">
                {winners.map((winner) => (
                  <div
                    key={winner.playerId}
                    className="flex justify-between items-center p-3 bg-green-50 rounded"
                  >
                    <span className="font-medium">{winner.playerId}</span>
                    <span className="text-green-700 font-bold">
                      +{Math.floor(payoutPerWinner).toLocaleString()} gold
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
              No winners - no participant selected this group.
            </div>
          )}

          {losers.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Losers ({losers.length}):
              </p>
              <div className="space-y-2">
                {losers.map((loser) => (
                  <div
                    key={loser.playerId}
                    className="flex justify-between items-center p-3 bg-red-50 rounded"
                  >
                    <span className="font-medium">{loser.playerId}</span>
                    <span className="text-red-700 font-bold">
                      -{bet.goldAmount.toLocaleString()} gold
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (bet.status === 'open') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-600">Resolution</h3>
        <p className="text-sm text-gray-500">
          Bet must be closed before it can be resolved. Wait for the closing time.
        </p>
      </div>
    )
  }

  if (uniqueGroups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Resolve Bet</h3>
        <p className="text-sm text-gray-500">
          No participants yet. Cannot resolve bet with no participants.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Resolve Bet</h3>

      <p className="text-sm text-gray-600 mb-4">
        Select the winning group based on performance:
      </p>

      <div className="space-y-3 mb-6">
        {uniqueGroups.map((group, index) => {
          const groupKey = group.sort().join(',')
          const isSelected = selectedGroup?.sort().join(',') === groupKey
          const bettorsCount = bet.participants.filter(
            (p) => p.selectedGroup.sort().join(',') === groupKey
          ).length

          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedGroup(group)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                isSelected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">Group {index + 1}</span>
                <span className="text-sm text-gray-500">
                  {bettorsCount} {bettorsCount === 1 ? 'bet' : 'bets'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.map((player) => (
                  <span
                    key={player}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    {player}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {success && <p className="text-sm text-green-600 mb-4">Bet resolved successfully!</p>}

      <button
        onClick={handleResolve}
        disabled={!selectedGroup || isLoading}
        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Resolving...' : 'Resolve Bet'}
      </button>
    </div>
  )
}
