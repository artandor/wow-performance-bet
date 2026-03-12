'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Bet } from '@/types'
import { getBetAction, placeBetAction, resolveBetAction, closeBetAction, reopenBetAction, updateBetInfoAction } from '@/app/actions/bet'
import { getRosterAction } from '@/app/actions/roster'
import BetDetails from '@/components/BetDetails'
import ParticipantList from '@/components/ParticipantList'
import BetParticipationForm from '@/components/BetParticipationForm'
import BetResolution from '@/components/BetResolution'
import BetControls from '@/components/BetControls'
import { updateBetStatus, canParticipate } from '@/lib/bet-status'

export default function BetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [bet, setBet] = useState<Bet | null>(null)
  const [roster, setRoster] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadData = async () => {
    setLoading(true)
    const [betData, rosterData] = await Promise.all([
      getBetAction(id),
      getRosterAction(),
    ])
    
    if (betData) {
      setBet(updateBetStatus(betData))
    }
    setRoster(rosterData)
    setLoading(false)
  }

  const handlePlaceBet = async (
    betId: string,
    playerId: string,
    selectedGroup: string[]
  ) => {
    await placeBetAction(betId, playerId, selectedGroup)
    await loadData()
  }

  const handleResolve = async (winningGroup: string[]) => {
    await resolveBetAction(id, winningGroup)
    await loadData()
  }

  const handleClose = async () => {
    await closeBetAction(id)
    await loadData()
  }

  const handleReopen = async () => {
    await reopenBetAction(id)
    await loadData()
  }

  const handleUpdateInfo = async (name: string, description: string) => {
    await updateBetInfoAction(id, name, description)
    await loadData()
  }

  if (loading) {
    return (
      <main className="container mx-auto p-8 max-w-6xl">
        <p className="text-gray-600">Loading bet details...</p>
      </main>
    )
  }

  if (!bet) {
    return (
      <main className="container mx-auto p-8 max-w-6xl">
        <p className="text-red-600">Bet not found</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Bets
        </Link>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Bets
        </Link>
      </div>

      <div className="space-y-6">
        <BetDetails bet={bet} onUpdate={handleUpdateInfo} />

        <div className="grid lg:grid-cols-2 gap-6">
          <ParticipantList participants={bet.participants} />

          <div className="space-y-6">
            <BetControls 
              bet={bet}
              onClose={handleClose}
              onReopen={handleReopen}
            />

            {canParticipate(bet) && roster.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Place Your Bet</h3>
                <BetParticipationForm
                  betId={bet.id}
                  roster={roster}
                  groupSize={bet.groupSize}
                  onPlaceBet={handlePlaceBet}
                />
              </div>
            )}

            {!canParticipate(bet) && bet.status !== 'resolved' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Betting Closed</h3>
                <p className="text-sm text-gray-600">
                  This bet is no longer accepting participants.
                </p>
              </div>
            )}
          </div>
        </div>

        <BetResolution bet={bet} onResolve={handleResolve} />
      </div>
    </main>
  )
}
