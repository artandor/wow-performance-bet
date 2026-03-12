'use client'

import { useState } from 'react'
import { Bet } from '@/types'

interface BetDetailsProps {
  bet: Bet
  onUpdate: (name: string, description: string) => Promise<void>
}

export default function BetDetails({ bet, onUpdate }: BetDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(bet.name)
  const [editDescription, setEditDescription] = useState(bet.description)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const potSize = bet.goldAmount * bet.participants.length
  const closingDate = new Date(bet.closesAt)
  const createdDate = new Date(bet.createdAt)

  const getStatusColor = (status: Bet['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-blue-100 text-blue-800'
    }
  }

  const handleSave = async () => {
    setError('')

    if (!editName.trim()) {
      setError('Bet name is required')
      return
    }

    if (!editDescription.trim()) {
      setError('Bet description is required')
      return
    }

    setIsLoading(true)
    try {
      await onUpdate(editName, editDescription)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bet')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditName(bet.name)
    setEditDescription(bet.description)
    setError('')
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bet Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter bet name"
                />
              </div>
              <p className="text-sm text-gray-500">
                Created {createdDate.toLocaleString()}
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900">{bet.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Created {createdDate.toLocaleString()}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              bet.status
            )}`}
          >
            {bet.status.toUpperCase()}
          </span>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
        <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
        {isEditing ? (
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description"
            rows={3}
          />
        ) : (
          <p className="text-gray-800">{bet.description}</p>
        )}
      </div>

      {isEditing && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-600">Gold per Player</p>
          <p className="text-2xl font-bold text-gray-900">{bet.goldAmount.toLocaleString()}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Total Pot</p>
          <p className="text-2xl font-bold text-green-600">{potSize.toLocaleString()}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Participants</p>
          <p className="text-2xl font-bold text-gray-900">{bet.participants.length}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Closes At</p>
          <p className="text-lg font-semibold text-gray-900">
            {closingDate.toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">{closingDate.toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  )
}
