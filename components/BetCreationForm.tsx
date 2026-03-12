'use client'

import { useState } from 'react'

interface BetCreationFormProps {
  onCreateBet: (goldAmount: number, closesAt: number) => Promise<void>
}

export default function BetCreationForm({ onCreateBet }: BetCreationFormProps) {
  const [goldAmount, setGoldAmount] = useState('')
  const [closingTime, setClosingTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    const gold = parseInt(goldAmount)
    if (isNaN(gold) || gold <= 0) {
      setError('Gold amount must be a positive number')
      return
    }

    const closingDate = new Date(closingTime)
    if (closingDate.getTime() <= Date.now()) {
      setError('Closing time must be in the future')
      return
    }

    setIsLoading(true)

    try {
      await onCreateBet(gold, closingDate.getTime())
      setSuccess(true)
      setGoldAmount('')
      setClosingTime('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bet')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="gold-amount" className="block text-sm font-medium text-gray-700 mb-1">
          Gold Amount (per participant)
        </label>
        <input
          id="gold-amount"
          type="number"
          value={goldAmount}
          onChange={(e) => setGoldAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="1000"
          required
        />
      </div>

      <div>
        <label htmlFor="closing-time" className="block text-sm font-medium text-gray-700 mb-1">
          Closing Time
        </label>
        <input
          id="closing-time"
          type="datetime-local"
          value={closingTime}
          onChange={(e) => setClosingTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-600">Bet created successfully!</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating...' : 'Create Bet'}
      </button>
    </form>
  )
}
