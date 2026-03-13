'use client'

import { BetH2H } from '@/types'
import { Coins, Swords } from 'lucide-react'

interface H2HPanelProps {
  bet: BetH2H
}

export default function H2HPanel({ bet }: H2HPanelProps) {
  const { sides, participants, goldAmount } = bet

  const sideA = participants.filter(p => p.sideIndex === 0)
  const sideB = participants.filter(p => p.sideIndex === 1)
  const total = participants.length

  const pctA = total > 0 ? Math.round((sideA.length / total) * 100) : 50
  const pctB = 100 - pctA

  const goldA = sideA.length * goldAmount
  const goldB = sideB.length * goldAmount
  const totalGold = goldA + goldB

  const isResolved = bet.status === 'resolved'
  const winnerIndex = bet.winningSideIndex

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">

      {/* Top split accent */}
      <div className="h-1 flex">
        <div className="flex-1 bg-gold" />
        <div className="flex-1 bg-table" />
      </div>

      {/* VS columns */}
      <div className="grid grid-cols-[1fr_auto_1fr]">

        {/* ── Side A — gold ── */}
        <div className={`bg-gold/[0.05] border-r border-white/8 p-6 flex flex-col items-center gap-3 text-center ${
          isResolved && winnerIndex === 1 ? 'opacity-40' : ''
        }`}>
          <div className="w-16 h-16 rounded-full border-2 border-gold/50 bg-elevated flex items-center justify-center text-3xl font-black text-gold">
            {sides[0][0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div className="flex items-center gap-1.5 justify-center">
              <p className="font-bold text-bright text-base">{sides[0]}</p>
              {isResolved && winnerIndex === 0 && (
                <span className="text-[10px] font-bold text-night bg-gold border border-gold px-1.5 py-0.5 rounded-full">WIN</span>
              )}
            </div>
            <p className="text-xs text-gold mt-0.5">{sideA.length} backer{sideA.length !== 1 ? 's' : ''}</p>
          </div>

          {goldA > 0 && (
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-gold" />
              <p className="text-lg font-bold text-gold">{goldA.toLocaleString()}g</p>
            </div>
          )}

          <p className="text-2xl font-black text-gold">{pctA}%</p>

          {total > 0 && (
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gold h-full rounded-full transition-all duration-500" style={{ width: `${pctA}%` }} />
            </div>
          )}

          {sideA.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mt-1">
              {sideA.map(p => (
                <span key={p.playerId} className="px-2 py-0.5 bg-elevated text-muted border border-white/8 rounded-full text-xs">
                  {p.playerName || p.playerId}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── VS centre ── */}
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-surface min-w-[90px]">
          <div className="w-12 h-12 rounded-full bg-elevated border border-white/15 flex items-center justify-center">
            <Swords className="w-5 h-5 text-muted/50" />
          </div>
          <span className="text-[10px] font-black text-muted tracking-widest">VS</span>
          {totalGold > 0 ? (
            <>
              <p className="text-[10px] text-muted/50 font-semibold uppercase tracking-wider">Pot</p>
              <p className="text-sm font-bold text-gold">{totalGold.toLocaleString()}g</p>
            </>
          ) : (
            <p className="text-[10px] text-muted/40 text-center leading-tight">No bets<br />yet</p>
          )}
        </div>

        {/* ── Side B — table / rouge ── */}
        <div className={`bg-table/[0.05] border-l border-white/8 p-6 flex flex-col items-center gap-3 text-center ${
          isResolved && winnerIndex === 0 ? 'opacity-40' : ''
        }`}>
          <div className="w-16 h-16 rounded-full border-2 border-table/50 bg-elevated flex items-center justify-center text-3xl font-black text-table">
            {sides[1][0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div className="flex items-center gap-1.5 justify-center">
              <p className="font-bold text-bright text-base">{sides[1]}</p>
              {isResolved && winnerIndex === 1 && (
                <span className="text-[10px] font-bold text-night bg-gold border border-gold px-1.5 py-0.5 rounded-full">WIN</span>
              )}
            </div>
            <p className="text-xs text-table mt-0.5">{sideB.length} backer{sideB.length !== 1 ? 's' : ''}</p>
          </div>

          {goldB > 0 && (
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-table" />
              <p className="text-lg font-bold text-table">{goldB.toLocaleString()}g</p>
            </div>
          )}

          <p className="text-2xl font-black text-table">{pctB}%</p>

          {total > 0 && (
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div className="bg-table h-full rounded-full transition-all duration-500" style={{ width: `${pctB}%` }} />
            </div>
          )}

          {sideB.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mt-1">
              {sideB.map(p => (
                <span key={p.playerId} className="px-2 py-0.5 bg-elevated text-muted border border-white/8 rounded-full text-xs">
                  {p.playerName || p.playerId}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom split progress bar */}
      {total > 0 && (
        <div className="h-2 flex">
          <div className="bg-gold transition-all duration-500" style={{ width: `${pctA}%` }} />
          <div className="bg-table flex-1" />
        </div>
      )}
    </div>
  )
}
