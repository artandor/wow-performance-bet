'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getGoldLedgerAction } from '@/app/actions/bet'
import type { LedgerEntry } from '@/lib/ledger'
import CoinLoader from '@/components/CoinLoader'
import { ChevronLeft, Crown, Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Podium styles per rank ────────────────────────────────────────────────

const PODIUM_STYLES = {
  1: {
    card:   'bg-gradient-to-b from-gold/25 via-gold/10 to-gold/5 ring-2 ring-gold/50 shadow-gold shimmer-gold',
    text:   'text-gold',
    badge:  'bg-gold/20 border border-gold/30',
    label:  '1st',
    pt:     'pt-10',
  },
  2: {
    card:   'bg-gradient-to-b from-slate-400/20 via-slate-500/8 to-transparent ring-1 ring-slate-400/30',
    text:   'text-slate-300',
    badge:  'bg-slate-500/20 border border-slate-400/25',
    label:  '2nd',
    pt:     'pt-6',
  },
  3: {
    card:   'bg-gradient-to-b from-orange-600/20 via-orange-700/8 to-transparent ring-1 ring-orange-500/30',
    text:   'text-orange-400',
    badge:  'bg-orange-600/20 border border-orange-500/25',
    label:  '3rd',
    pt:     'pt-4',
  },
} as const

type PodiumRank = keyof typeof PODIUM_STYLES

function PodiumCard({ entry, rank, className }: {
  entry: LedgerEntry
  rank: PodiumRank
  className?: string
}) {
  const s = PODIUM_STYLES[rank]
  const isPos = entry.netGold > 0
  const isNeg = entry.netGold < 0

  return (
    <div className={cn(
      'relative rounded-2xl border border-white/8 p-4 pb-6 flex flex-col items-center gap-2.5 overflow-hidden',
      'transition-transform hover:scale-[1.02]',
      s.card, s.pt, className,
    )}>
      {/* Rank icon */}
      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', s.badge)}>
        {rank === 1
          ? <Crown className="w-5 h-5 text-gold" />
          : <Trophy className={cn('w-4 h-4', s.text)} />}
      </div>

      {/* Position label */}
      <span className={cn('text-[11px] font-black uppercase tracking-[0.2em]', s.text)}>{s.label}</span>

      {/* Player name */}
      <p className="text-sm font-bold text-bright text-center leading-snug">{entry.playerName}</p>

      {/* Net gold — big number */}
      <p className={cn(
        'text-2xl font-black font-display tabular-nums leading-none',
        isPos ? 'text-goblin' : isNeg ? 'text-red-400' : 'text-muted',
      )}>
        {isPos ? '+' : ''}{entry.netGold.toLocaleString()}
        <span className="text-sm font-normal ml-1 opacity-60">g</span>
      </p>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-muted/70">
        <span className="text-goblin font-semibold">{entry.wins}W</span>
        <span className="text-white/20">·</span>
        <span className="text-red-400 font-semibold">{entry.losses}L</span>
        <span className="text-white/20">·</span>
        <span>{entry.betsPlaced} bets</span>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function LedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGoldLedgerAction().then(data => { setEntries(data); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <CoinLoader />
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to bets
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
          <Crown className="w-6 h-6 text-gold" />
        </div>
        <div>
          <h1 className="text-3xl font-black font-display text-gold-gradient leading-none">
            Gold Ledger
          </h1>
          <p className="text-sm text-muted mt-1">Net gold standings from all resolved bets</p>
        </div>
      </div>


      <div
        className="mb-8 rounded-xl border border-dashed border-white/10 bg-elevated/20 min-h-[150px] overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/ledger.png)' }}
        aria-label="Banner slot"
      >

      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-white/10 bg-surface/50">
          <Crown className="w-12 h-12 text-muted/20 mb-4" />
          <p className="text-muted text-sm">No resolved bets yet — glory awaits.</p>
        </div>
      ) : (
        <>
          {/* ── Podium: top 3 ─────────────────────────────────────────── */}
          <div className="flex items-end justify-center gap-3 sm:gap-5 mb-8">
            {/* Silver: 2nd — rendered left */}
            {entries[1] && (
              <PodiumCard
                entry={entries[1]}
                rank={2}
                className="flex-1 max-w-[148px] sm:max-w-[196px]"
              />
            )}

            {/* Gold: 1st — center, tallest */}
            <PodiumCard
              entry={entries[0]}
              rank={1}
              className="flex-1 max-w-[172px] sm:max-w-[224px]"
            />

            {/* Bronze: 3rd — rendered right */}
            {entries[2] && (
              <PodiumCard
                entry={entries[2]}
                rank={3}
                className="flex-1 max-w-[148px] sm:max-w-[196px]"
              />
            )}
          </div>

          {/* ── Rank 4 + table ─────────────────────────────────────────── */}
          {entries.length > 3 && (
            <div className="rounded-xl border border-white/10 bg-surface overflow-hidden">
              {/* Header row */}
              <div className="px-5 py-3 border-b border-white/8 grid grid-cols-[2.5rem_1fr_auto_auto_auto] gap-x-4 text-[11px] text-muted uppercase tracking-widest">
                <span className="text-center">#</span>
                <span>Player</span>
                <span className="text-right hidden sm:block">Bets</span>
                <span className="text-right">W&thinsp;/&thinsp;L</span>
                <span className="text-right">Net Gold</span>
              </div>

              {entries.slice(3).map((entry, i) => {
                const rank = i + 4
                const isPos = entry.netGold > 0
                const isNeg = entry.netGold < 0
                return (
                  <div
                    key={entry.playerId}
                    className={cn(
                      'px-5 py-3.5 grid grid-cols-[2.5rem_1fr_auto_auto_auto] gap-x-4 items-center border-b border-white/5 last:border-0 transition-colors hover:bg-elevated/40',
                    )}
                  >
                    <span className="text-center text-sm font-semibold text-muted/45">{rank}</span>
                    <span className="text-sm font-medium text-bright truncate">{entry.playerName}</span>
                    <span className="text-xs text-muted text-right hidden sm:block">{entry.betsPlaced}</span>
                    <span className="text-xs text-right whitespace-nowrap">
                      <span className="text-goblin font-semibold">{entry.wins}W</span>
                      <span className="text-white/20 mx-0.5">/</span>
                      <span className="text-red-400 font-semibold">{entry.losses}L</span>
                    </span>
                    <span className={cn(
                      'text-sm font-bold text-right flex items-center justify-end gap-1 tabular-nums',
                      isPos ? 'text-goblin' : isNeg ? 'text-red-400' : 'text-muted',
                    )}>
                      {isPos
                        ? <TrendingUp   className="w-3 h-3 flex-shrink-0" />
                        : isNeg
                          ? <TrendingDown className="w-3 h-3 flex-shrink-0" />
                          : <Minus       className="w-3 h-3 flex-shrink-0" />}
                      {isPos ? '+' : ''}{entry.netGold.toLocaleString()}&nbsp;g
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </main>
  )
}
