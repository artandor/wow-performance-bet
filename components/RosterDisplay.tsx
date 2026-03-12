interface RosterDisplayProps {
  roster: string[]
}

export default function RosterDisplay({ roster }: RosterDisplayProps) {
  if (roster.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No players in roster. Import a roster to get started.
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">
        Current Roster ({roster.length} players)
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {roster.map((player, index) => (
          <div
            key={index}
            className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm"
          >
            {player}
          </div>
        ))}
      </div>
    </div>
  )
}
