'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllBetsAction, deleteBetAction } from './actions/bet'
import { updateBetStatus, getTimeRemaining } from '@/lib/bet-status'
import { Bet, getBetKind, BetPrediction, BetH2H } from '@/types'
import DeleteBetButton from '@/components/DeleteBetButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Coins, Users, Trophy, Clock, PlusCircle, Swords, HelpCircle, BarChart3 } from 'lucide-react'
import CoinLoader from '@/components/CoinLoader'
import { cn } from '@/lib/utils'

const STATUS_BADGE: Record<Bet['status'], 'open' | 'closed' | 'resolved'> = {
  open: 'open',
  closed: 'closed',
  resolved: 'resolved',
}
const STATUS_LABEL: Record<Bet['status'], string> = {
  open: 'Open',
  closed: 'Closed',
  resolved: 'Resolved',
}

const KIND_BADGE_CLASSES = {
  'group-dps':  'bg-gold/10 text-gold border border-gold/25',
  'prediction': 'bg-neon/10 text-neon border border-neon/25',
  'h2h':        'bg-goblin/10 text-goblin border border-goblin/25',
}
const KIND_LABELS = {
  'group-dps':  'Group DPS',
  'prediction': 'Prediction',
  'h2h':        'H2H',
}
const KIND_ICONS: Record<string, React.ReactNode> = {
  'group-dps':  <Users className="w-3 h-3" />,
  'prediction': <HelpCircle className="w-3 h-3" />,
  'h2h':        <Swords className="w-3 h-3" />,
}

export default function Home() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadBets() }, [])

  const loadBets = async () => {
    setLoading(true)
    const data = await getAllBetsAction()
    setBets(data.map(updateBetStatus))
    setLoading(false)
  }

  const handleDelete = async (betId: string) => {
    await deleteBetAction(betId)
    await loadBets()
  }

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <CoinLoader />
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-bright flex items-center gap-2">
            <Swords className="w-6 h-6 text-gold" />
            Active Bets
          </h1>
          <p className="text-sm text-muted mt-0.5">{bets.length} bet{bets.length !== 1 ? 's' : ''} available</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/ledger">
              <BarChart3 className="w-4 h-4 mr-1.5" />
              Ledger
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/roster">Roster</Link>
          </Button>
          <Button asChild>
            <Link href="/bets/new" className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Create Bet
            </Link>
          </Button>
        </div>
      </div>

      {bets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-white/15 bg-surface/50">
          <Swords className="w-12 h-12 text-muted/30 mb-4" />
          <p className="text-muted mb-6 text-sm">No bets yet.</p>
          <Button asChild>
            <Link href="/bets/new" className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Create the first bet
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {bets.map((bet) => {
            const kind = getBetKind(bet)
            const potSize = bet.goldAmount * bet.participants.length

            let subLabel = ''
            if (kind === 'prediction') {
              const p = bet as BetPrediction
              const labelMap: Record<string, string> = { 'closest-number': 'Closest Number', 'over-under': 'Over/Under', 'binary': 'Yes/No', 'multiple-choice': 'Multiple Choice' }
              subLabel = labelMap[p.answerType] ?? ''
            }
            if (kind === 'h2h') {
              const h = bet as BetH2H
              subLabel = `${h.sides[0]} vs ${h.sides[1]}`
            }

            return (
              <Link key={bet.id} href={`/bets/${bet.id}`} className="group block">
                <div className={cn(
                  'rounded-xl border bg-surface transition-all duration-200',
                  'hover:border-gold/25 hover:bg-elevated/80 hover:shadow-gold/5 hover:shadow-lg',
                  bet.status === 'open' ? 'border-white/10' :
                  bet.status === 'closed' ? 'border-gold/15' :
                  'border-goblin/15'
                )}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant={STATUS_BADGE[bet.status]}>{STATUS_LABEL[bet.status]}</Badge>
                          <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', KIND_BADGE_CLASSES[kind])}>
                            {KIND_ICONS[kind]}
                            {KIND_LABELS[kind]}
                          </span>
                          {bet.status === 'open' && (
                            <span className="text-xs text-muted flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {getTimeRemaining(bet.closesAt)}
                            </span>
                          )}
                        </div>
                        <h2 className="text-base font-semibold text-bright group-hover:text-gold transition-colors truncate">
                          {bet.name}
                        </h2>
                        <p className="text-sm text-muted mt-0.5 line-clamp-1">
                          {subLabel && <span className="text-xs font-medium mr-1.5 opacity-70">[{subLabel}]</span>}
                          {bet.description}
                        </p>
                      </div>
                      <div onClick={(e) => e.preventDefault()} className="flex-shrink-0">
                        <DeleteBetButton betId={bet.id} onDelete={handleDelete} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Coins className="w-3 h-3" />Wager
                        </span>
                        <span className="text-sm font-bold text-gold">{bet.goldAmount.toLocaleString()} g</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Users className="w-3 h-3" />Entries
                        </span>
                        <span className="text-sm font-bold text-bright">{bet.participants.length}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Trophy className="w-3 h-3" />Pot
                        </span>
                        <span className="text-sm font-bold text-goblin">
                          {potSize > 0 ? `${potSize.toLocaleString()} g` : '--'}
                        </span>
                      </div>
                    </div>
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

