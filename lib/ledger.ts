import { Bet, BetPrediction, BetH2H, getBetKind } from '@/types'

export interface LedgerEntry {
  playerId: string
  playerName: string
  wins: number
  losses: number
  netGold: number
  betsPlaced: number
}

export function computeLedger(bets: Bet[]): LedgerEntry[] {
  const map = new Map<string, LedgerEntry>()

  const ensure = (id: string, name: string) => {
    if (!map.has(id)) map.set(id, { playerId: id, playerName: name, wins: 0, losses: 0, netGold: 0, betsPlaced: 0 })
    return map.get(id)!
  }

  for (const bet of bets) {
    if (bet.status !== 'resolved') continue
    const kind = getBetKind(bet)

    if (kind === 'group-dps' || kind === undefined) {
      const b = bet as { participants: { playerId: string; playerName?: string; selectedGroup?: string[] }[]; winningGroup?: string[]; goldAmount: number }
      const potSize = b.goldAmount * b.participants.length
      const winnersArr = b.participants.filter(p =>
        p.selectedGroup && b.winningGroup &&
        [...(p.selectedGroup ?? [])].sort().join(',') === [...(b.winningGroup ?? [])].sort().join(',')
      )
      const payoutPerWinner = winnersArr.length > 0 ? potSize / winnersArr.length : 0
      for (const p of b.participants) {
        const e = ensure(p.playerId, p.playerName ?? p.playerId)
        e.betsPlaced++
        const isWinner = winnersArr.some(w => w.playerId === p.playerId)
        if (isWinner) { e.wins++; e.netGold += Math.floor(payoutPerWinner) - b.goldAmount }
        else { e.losses++; e.netGold -= b.goldAmount }
      }
    }

    if (kind === 'prediction') {
      const b = bet as BetPrediction
      const potSize = b.goldAmount * b.participants.length
      const winnerIds = new Set(b.winnerIds ?? [])
      const winnerCount = winnerIds.size
      const payoutPerWinner = winnerCount > 0 ? potSize / winnerCount : 0
      for (const p of b.participants) {
        const e = ensure(p.playerId, p.playerName ?? p.playerId)
        e.betsPlaced++
        if (winnerIds.has(p.playerId)) { e.wins++; e.netGold += Math.floor(payoutPerWinner) - b.goldAmount }
        else { e.losses++; e.netGold -= b.goldAmount }
      }
    }

    if (kind === 'h2h') {
      const b = bet as BetH2H
      if (b.winningSideIndex == null) continue
      const winners = b.participants.filter(p => p.sideIndex === b.winningSideIndex)
      const potSize = b.goldAmount * b.participants.length
      const payoutPerWinner = winners.length > 0 ? potSize / winners.length : 0
      for (const p of b.participants) {
        const e = ensure(p.playerId, p.playerName ?? p.playerId)
        e.betsPlaced++
        const isWinner = winners.some(w => w.playerId === p.playerId)
        if (isWinner) { e.wins++; e.netGold += Math.floor(payoutPerWinner) - b.goldAmount }
        else { e.losses++; e.netGold -= b.goldAmount }
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => b.netGold - a.netGold)
}
