'use client'

import { cn } from '@/lib/utils'

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
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-bright">
          Select {maxPlayers} player{maxPlayers > 1 ? 's' : ''}
        </span>
        <span className="text-xs text-muted tabular-nums">
          <span className={selectedPlayers.length === maxPlayers ? 'text-goblin font-semibold' : 'text-gold'}>
            {selectedPlayers.length}
          </span>
          <span className="text-muted"> / {maxPlayers}</span>
        </span>
      </div>

      {roster.length === 0 ? (
        <p className="text-muted text-sm">
          No roster available. Import a roster first.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-72 overflow-y-auto p-1 rounded-lg border border-white/10 bg-night/50">
          {roster.map((player) => {
            const isSelected = selectedPlayers.includes(player)
            const isDisabled = !isSelected && selectedPlayers.length >= maxPlayers

            return (
              <button
                key={player}
                type="button"
                onClick={() => togglePlayer(player)}
                disabled={isDisabled}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 text-left',
                  isSelected
                    ? 'bg-gold text-night shadow-gold/20 shadow-sm'
                    : isDisabled
                    ? 'bg-elevated/40 text-muted/40 cursor-not-allowed'
                    : 'bg-elevated text-bright border border-white/10 hover:border-gold/40 hover:bg-rim'
                )}
              >
                {player}
              </button>
            )
          })}
        </div>
      )}

      {selectedPlayers.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-2">Selected group:</p>
          <div className="flex flex-wrap gap-2">
            {selectedPlayers.map((player) => (
              <span
                key={player}
                className="px-2.5 py-1 bg-gold/15 text-gold border border-gold/25 rounded-full text-xs font-medium"
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
