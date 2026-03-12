import { Bet } from '@/types'

interface BetDetailsProps {
  bet: Bet
}

export default function BetDetails({ bet }: BetDetailsProps) {
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

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bet Details</h2>
          <p className="text-sm text-gray-500 mt-1">
            Created {createdDate.toLocaleString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            bet.status
          )}`}
        >
          {bet.status.toUpperCase()}
        </span>
      </div>

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
