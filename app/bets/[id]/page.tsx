'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Bet, BetPrediction, BetH2H, getBetKind } from '@/types'
import {
  getBetAction,
  placeBetAction,
  resolveBetAction,
  resolvePredictionBetAction,
  resolveH2HBetAction,
  placePredictionAnswerAction,
  placeH2HAction,
  closeBetAction,
  reopenBetAction,
  updateBetInfoAction,
} from '@/app/actions/bet'
import { getRosterAction } from '@/app/actions/roster'
import BetDetails from '@/components/BetDetails'
import ParticipantList from '@/components/ParticipantList'
import H2HPanel from '@/components/H2HPanel'
import BetParticipationForm from '@/components/BetParticipationForm'
import BetResolution from '@/components/BetResolution'
import BetControls from '@/components/BetControls'
import PredictionParticipationForm from '@/components/PredictionParticipationForm'
import H2HParticipationForm from '@/components/H2HParticipationForm'
import PredictionResolution from '@/components/PredictionResolution'
import H2HResolution from '@/components/H2HResolution'
import CoinLoader from '@/components/CoinLoader'
import { updateBetStatus, canParticipate } from '@/lib/bet-status'
import { ChevronLeft, Coins, Swords } from 'lucide-react'

export default function BetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [bet, setBet] = useState<Bet | null>(null)
  const [roster, setRoster] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    setLoading(true)
    const [betData, rosterData] = await Promise.all([getBetAction(id), getRosterAction()])
    if (betData) setBet(updateBetStatus(betData))
    setRoster(rosterData)
    setLoading(false)
  }

  const handleClose        = async () => { await closeBetAction(id); await loadData() }
  const handleReopen       = async () => { await reopenBetAction(id); await loadData() }
  const handleUpdateInfo   = async (name: string, desc: string) => { await updateBetInfoAction(id, name, desc); await loadData() }
  const handlePlaceBet     = async (_: string, group: string[]) => { await placeBetAction(id, group); await loadData() }
  const handleResolveGroup = async (group: string[]) => { await resolveBetAction(id, group); await loadData() }
  const handlePlacePred    = async (answer: string)  => { await placePredictionAnswerAction(id, answer); await loadData() }
  const handleResolvePred  = async (answer: string)  => { await resolvePredictionBetAction(id, answer); await loadData() }
  const handlePlaceH2H     = async (side: 0 | 1)     => { await placeH2HAction(id, side); await loadData() }
  const handleResolveH2H   = async (side: 0 | 1)     => { await resolveH2HBetAction(id, side); await loadData() }

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <CoinLoader />
      </main>
    )
  }

  if (!bet) {
    return (
      <main className="container mx-auto p-8 max-w-5xl">
        <p className="text-orange-400 mb-4">Bet not found.</p>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold/80 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to bets
        </Link>
      </main>
    )
  }

  const kind = getBetKind(bet)
  const isParticipating = canParticipate(bet)
  const showResolution = bet.status === 'closed' || bet.status === 'resolved'

  return (
    <main className="container mx-auto px-4 py-6 max-w-5xl space-y-6">

      {/* ── Back ─────────────────────────────────────────────────────────── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to bets
      </Link>

      {/* ── Hero: title, kind, status, stats ─────────────────────────────── */}
      <BetDetails bet={bet} onUpdate={handleUpdateInfo} />

      {/* ── Main body ──────────────────────────────────────────────────────── */}
      {kind === 'h2h' ? (

        // ── H2H: full-width panel + vote below ──
        <div className="space-y-4">
          <H2HPanel bet={bet as BetH2H} />

          {isParticipating && (
            <div className="rounded-xl border border-white/10 bg-surface p-6">
              <div className="flex items-center gap-2 mb-5">
                <Swords className="w-4 h-4 text-gold" />
                <h3 className="text-sm font-semibold text-bright">Pick Your Side</h3>
                <span className="text-xs text-muted ml-1">({bet.goldAmount.toLocaleString()}g entry)</span>
              </div>
              <H2HParticipationForm bet={bet as BetH2H} onSubmit={handlePlaceH2H} />
            </div>
          )}

          {!isParticipating && bet.status === 'closed' && (
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-5">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Betting Closed</p>
              <p className="text-sm text-muted/70">No new entries allowed. Awaiting resolution below.</p>
            </div>
          )}

          {bet.status !== 'resolved' && (
            <BetControls bet={bet} onClose={handleClose} onReopen={handleReopen} />
          )}
        </div>

      ) : (

        // ── group-dps / prediction: 5-col grid ──
        <div className="grid lg:grid-cols-5 gap-5">

          {/* LEFT — participants (3/5) */}
          <div className="lg:col-span-3">
            <ParticipantList bet={bet} />
          </div>

          {/* RIGHT — action + admin (2/5) */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {isParticipating && kind === 'group-dps' && roster.length > 0 && (
              <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Coins className="w-4 h-4 text-gold" />
                  <h3 className="text-sm font-semibold text-bright">Place Your Bet</h3>
                </div>
                <BetParticipationForm
                  betId={bet.id}
                  roster={roster}
                  groupSize={(bet as { groupSize?: number }).groupSize ?? 1}
                  onPlaceBet={handlePlaceBet}
                />
              </div>
            )}

            {isParticipating && kind === 'prediction' && (
              <div className="rounded-xl border border-neon-pink/20 bg-neon-pink/5 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-neon-pink" />
                  <h3 className="text-sm font-semibold text-bright">Submit Your Answer</h3>
                </div>
                <PredictionParticipationForm bet={bet as BetPrediction} onSubmit={handlePlacePred} />
              </div>
            )}

            {!isParticipating && bet.status === 'closed' && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-5">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Betting Closed</p>
                <p className="text-sm text-muted/70">No new entries allowed. Awaiting resolution below.</p>
              </div>
            )}

            {bet.status !== 'resolved' && (
              <BetControls bet={bet} onClose={handleClose} onReopen={handleReopen} />
            )}
          </div>
        </div>

      )}

      {/* ── Resolution panel — full-width, only when relevant ────────────── */}
      {showResolution && (
        <div>
          {kind === 'group-dps'  && <BetResolution        bet={bet}                  onResolve={handleResolveGroup} />}
          {kind === 'prediction' && <PredictionResolution bet={bet as BetPrediction} onResolve={handleResolvePred} />}
          {kind === 'h2h'        && <H2HResolution        bet={bet as BetH2H}        onResolve={handleResolveH2H} />}
        </div>
      )}
    </main>
  )
}

