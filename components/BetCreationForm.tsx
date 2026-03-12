'use client'

import { useState } from 'react'

interface BetCreationFormProps {
  onCreateBet: (name: string, description: string, goldAmount: number, groupSize: number, closesAt: number) => Promise<void>
}

export default function BetCreationForm({ onCreateBet }: BetCreationFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [goldAmount, setGoldAmount] = useState('')
  const [groupSize, setGroupSize] = useState('5')
  const [closingTime, setClosingTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (!name.trim()) {
      setError('Bet name is required')
      return
    }

    if (!description.trim()) {
      setError('Bet description is required')
      return
    }

    const gold = parseInt(goldAmount)
    if (isNaN(gold) || gold <= 0) {
      setError('Gold amount must be a positive number')
      return
    }

    const size = parseInt(groupSize)
    if (isNaN(size) || size < 1 || size > 40) {
      setError('Group size must be between 1 and 40')
      return
    }

    const closingDate = new Date(closingTime)
    if (closingDate.getTime() <= Date.now()) {
      setError('Closing time must be in the future')
      return
    }

    setIsLoading(true)

    try {
      await onCreateBet(name.trim(), description.trim(), gold, size, closingDate.getTime())
      setSuccess(true)
      setName('')
      setDescription('')
      setGoldAmount('')
      setGroupSize('5')
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
        <label htmlFor="bet-name" className="block text-sm font-medium text-gray-700 mb-1">
          Bet Name
        </label>
        <input
          id="bet-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Mythic+ Speed Run"
          required
        />
      </div>

      <div>
        <label htmlFor="bet-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="bet-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Which group will complete the most +20 keys in 2 hours?"
          rows={3}
          required
        />
      </div>

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
        <label htmlFor="group-size" className="block text-sm font-medium text-gray-700 mb-1">
          Group Size (players per team)
        </label>
        <input
          id="group-size"
          type="number"
          min="1"
          max="40"
          value={groupSize}
          onChange={(e) => setGroupSize(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="5"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Default: 5 players. Choose 1-40 players per team.</p>
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
