'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Users, AlertCircle } from 'lucide-react'
import BetKindSelector from '@/components/BetKindSelector'
import BetCreationForm from '@/components/BetCreationForm'
import PredictionBetForm from '@/components/PredictionBetForm'
import H2HBetForm from '@/components/H2HBetForm'
import { createBetAction, createPredictionBetAction, createH2HBetAction } from '@/app/actions/bet'
import { getRosterAction } from '@/app/actions/roster'
import { BetKind, PredictionAnswerType } from '@/types'
import CoinLoader from '@/components/CoinLoader'

const kindLabels: Record<BetKind, string> = {
  'group-dps':  'Group DPS Bet',
  'prediction': 'Prediction Bet',
  'h2h':        'Head-to-Head Bet',
}

const ROSTER_NEEDED: BetKind[] = ['group-dps', 'h2h']

export default function NewBetPage() {
  const router = useRouter()
  const [kind, setKind] = useState<BetKind | null>(null)
  const [roster, setRoster] = useState<string[]>([])
  const [rosterLoading, setRosterLoading] = useState(true)

  useEffect(() => {
    getRosterAction().then(r => { setRoster(r); setRosterLoading(false) })
  }, [])

  const handleCreateGroupDps = async (name: string, description: string, goldAmount: number, groupSize: number, closesAt: number) => {
    const betId = await createBetAction(name, description, goldAmount, groupSize, closesAt)
    router.push(`/bets/${betId}`)
  }

  const handleCreatePrediction = async (
    name: string,
    description: string,
    goldAmount: number,
    closesAt: number,
    answerType: PredictionAnswerType,
    options: { choices?: string[]; line?: number; unit?: string },
  ) => {
    const betId = await createPredictionBetAction(name, description, goldAmount, closesAt, answerType, options)
    router.push(`/bets/${betId}`)
  }

  const handleCreateH2H = async (name: string, description: string, goldAmount: number, closesAt: number, sideA: string, sideB: string) => {
    const betId = await createH2HBetAction(name, description, goldAmount, closesAt, sideA, sideB)
    router.push(`/bets/${betId}`)
  }

  const rosterEmpty = !rosterLoading && roster.length === 0
  const needsRoster = kind && ROSTER_NEEDED.includes(kind)

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to bets
        </Link>
        {kind && (
          <button
            type="button"
            onClick={() => setKind(null)}
            className="text-xs text-muted hover:text-bright transition-colors ml-auto"
          >
            ← Change type
          </button>
        )}
      </div>

      <h1 className="text-2xl font-bold text-bright mb-6">
        {kind ? kindLabels[kind] : 'Create a new bet'}
      </h1>

      {rosterLoading && !kind && (
        <div className="flex justify-center py-12"><CoinLoader /></div>
      )}

      {!rosterLoading && !kind && <BetKindSelector onSelect={setKind} />}

      {/* Guardrail: roster required but empty */}
      {needsRoster && rosterEmpty && (
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-400 mb-1">Roster required</p>
            <p className="text-xs text-muted/80">
              This bet type needs at least one player in the roster.
              <Link href="/roster" className="text-gold hover:underline ml-1 inline-flex items-center gap-1">
                <Users className="w-3 h-3" /> Go to Roster
              </Link>
            </p>
          </div>
        </div>
      )}

      {kind === 'group-dps' && !rosterEmpty && <BetCreationForm roster={roster} onCreateBet={handleCreateGroupDps} />}
      {kind === 'prediction' && <PredictionBetForm onCreateBet={handleCreatePrediction} />}
      {kind === 'h2h' && !rosterEmpty && <H2HBetForm roster={roster} onCreateBet={handleCreateH2H} />}
    </main>
  )
}

