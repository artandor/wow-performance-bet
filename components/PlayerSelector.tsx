'use client'

import { useState } from 'react'

interface PlayerSelectorProps {
  roster: string[]
  selectedPlayers: string[]
  onSelectionChange: (players: string[]) => void
  maxPlayers?: number
}

export default function PlayerSelector({
  roster,
  selectedPlayers,
  onSelectionChange,
  maxPlayers = 5,
}: PlayerSelectorProps) {
  const togglePlayer = (player: string) => {
    if (selectedPlayers.includes(player)) {
      onSelectionChange(selectedPlayers.filter(p => p !== player))
    } else if (selectedPlayers.length < maxPlayers) {
      onSelectionChange([...selectedPlayers, player])
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-medium text-gray-700">
          Select {maxPlayers} Players
        </label>
        <span className="text-sm text-gray-500">
          {selectedPlayers.length} / {maxPlayers} selected
        </span>
      </div>

      {roster.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No roster available. Please import a roster first.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto p-2 border border-gray-200 rounded-md">
          {roster.map((player) => {
            const isSelected = selectedPlayers.includes(player)
            const isDisabled = !isSelected && selectedPlayers.length >= maxPlayers

            return (
              <button
                key={player}
                type="button"
                onClick={() => togglePlayer(player)}
                disabled={isDisabled}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {player}
              </button>
            )
          })}
        </div>
      )}

      {selectedPlayers.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected Group:</p>
          <div className="flex flex-wrap gap-2">
            {selectedPlayers.map((player) => (
              <span
                key={player}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
              >
                {player}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
