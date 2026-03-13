import { Participant } from '@/types'

interface ParticipantListProps {
  participants: Participant[]
}

export default function ParticipantList({ participants }: ParticipantListProps) {
  if (participants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Participants</h3>
        <p className="text-gray-500">No participants yet. Be the first to place a bet!</p>
      </div>
    )
  }

  // Group participants by their selected group
  const groupedParticipants = participants.reduce((acc, participant) => {
    const groupKey = participant.selectedGroup.sort().join(',')
    if (!acc[groupKey]) {
      acc[groupKey] = {
        group: participant.selectedGroup,
        participants: [],
      }
    }
    acc[groupKey].participants.push({
      id: participant.playerId,
      name: participant.playerName || participant.playerId,
    })
    return acc
  }, {} as Record<string, { group: string[]; participants: Array<{ id: string; name: string }> }>)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Participants ({participants.length})
      </h3>

      <div className="space-y-4">
        {Object.values(groupedParticipants).map((groupData, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Group {index + 1} ({groupData.participants.length}{' '}
                {groupData.participants.length === 1 ? 'bet' : 'bets'})
              </p>
              <div className="flex flex-wrap gap-2">
                {groupData.group.map((player) => (
                  <span
                    key={player}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    {player}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Bet by:</p>
              <div className="flex flex-wrap gap-2">
                {groupData.participants.map((player) => (
                  <span
                    key={player.id}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {player.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
