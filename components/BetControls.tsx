'use client'

import { useState } from 'react'
import { Bet } from '@/types'

interface BetControlsProps {
  bet: Bet
  onClose: () => Promise<void>
  onReopen: () => Promise<void>
}

export default function BetControls({ bet, onClose, onReopen }: BetControlsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleClose = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await onClose()
      setSuccess('Bet closed successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close bet')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReopen = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await onReopen()
      setSuccess('Bet reopened successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reopen bet')
    } finally {
      setIsLoading(false)
    }
  }

  if (bet.status === 'resolved') {
    return null // Can't close/reopen resolved bets
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Bet Controls</h3>

      <div className="space-y-3">
        {bet.status === 'open' && (
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Closing...' : 'Close Bet Now'}
          </button>
        )}

        {bet.status === 'closed' && (
          <button
            onClick={handleReopen}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Reopening...' : 'Reopen Bet'}
          </button>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <p className="text-xs text-gray-500">
          {bet.status === 'open' 
            ? 'Closing the bet will prevent new participants from joining.'
            : 'Reopening will allow participants to join again.'}
        </p>
      </div>
    </div>
  )
}
