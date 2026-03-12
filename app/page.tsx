'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllBetsAction, deleteBetAction } from './actions/bet'
import { updateBetStatus } from '@/lib/bet-status'
import { Bet } from '@/types'
import DeleteBetButton from '@/components/DeleteBetButton'

export default function Home() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBets()
  }, [])

  const loadBets = async () => {
    setLoading(true)
    const data = await getAllBetsAction()
    const updatedBets = data.map(updateBetStatus)
    setBets(updatedBets)
    setLoading(false)
  }

  const handleDelete = async (betId: string) => {
    await deleteBetAction(betId)
    await loadBets()
  }

  if (loading) {
    return (
      <main className="container mx-auto p-8 max-w-6xl">
        <p className="text-gray-600">Loading bets...</p>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">WoW DPS Betting</h1>
        <div className="space-x-4">
          <Link
            href="/roster"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Manage Roster
          </Link>
          <Link
            href="/bets/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Bet
          </Link>
        </div>
      </div>

      {bets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">No bets yet. Create one to get started!</p>
          <Link
            href="/bets/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create First Bet
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bets.map((bet) => {
            const potSize = bet.goldAmount * bet.participants.length
            const statusColors = {
              open: 'bg-green-100 text-green-800',
              closed: 'bg-yellow-100 text-yellow-800',
              resolved: 'bg-blue-100 text-blue-800',
            }

            return (
              <Link
                key={bet.id}
                href={`/bets/${bet.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {bet.goldAmount.toLocaleString()} Gold per Player
                    </h2>
                    <p className="text-sm text-gray-500">
                      Created {new Date(bet.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[bet.status]
                      }`}
                    >
                      {bet.status.toUpperCase()}
                    </span>
                    <DeleteBetButton betId={bet.id} onDelete={handleDelete} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Participants</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bet.participants.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Pot</p>
                    <p className="text-2xl font-bold text-green-600">
                      {potSize.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Closes</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(bet.closesAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}

