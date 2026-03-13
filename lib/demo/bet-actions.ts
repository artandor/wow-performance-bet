/**
 * DEMO MODE – All bet-related action implementations backed by the in-memory store.
 * These are plain functions (not server actions); they are called from within
 * the real 'use server' action wrappers in app/actions/bet.ts.
 */
import { Bet, BetGroupDps, BetPrediction, BetH2H, PredictionAnswerType } from '@/types'
import { computeLedger, LedgerEntry } from '@/lib/ledger'
import {
  getAllBets,
  getBetById,
  saveBet,
  removeBet,
  getRoster,
  generateId,
  DEMO_SERVER_ID,
  DEMO_USER_ID,
  DEMO_USERNAME,
} from './store'

export function demoGetAllBets(): Bet[] {
  return getAllBets()
}

export function demoGetBet(id: string): Bet | null {
  return getBetById(id)
}

export function demoCreateBet(
  name: string,
  description: string,
  goldAmount: number,
  groupSize: number,
  closesAt: number,
): string {
  const id = generateId()
  const bet: BetGroupDps = {
    id,
    kind: 'group-dps',
    name: name.trim(),
    description: description.trim(),
    goldAmount,
    groupSize,
    status: 'open',
    createdAt: Date.now(),
    closesAt,
    participants: [],
    serverId: DEMO_SERVER_ID,
  }
  saveBet(bet)
  return id
}

export function demoPlaceBet(betId: string, selectedGroup: string[]): void {
  const bet = getBetById(betId)
  if (!bet) throw new Error('Bet not found')
  if (bet.status !== 'open') throw new Error('Bet is not open for participation')
  if (bet.participants.find(p => p.playerId === DEMO_USER_ID)) {
    throw new Error('You have already placed a bet')
  }
  const participant = {
    kind: 'group-dps' as const,
    playerId: DEMO_USER_ID,
    playerName: DEMO_USERNAME,
    selectedGroup,
  }
  saveBet({ ...bet, participants: [...bet.participants, participant] } as Bet)
}

export function demoResolveBet(betId: string, winningGroup: string[]): void {
  const bet = getBetById(betId)
  if (!bet) throw new Error('Bet not found')
  saveBet({ ...bet, status: 'resolved', winningGroup } as Bet)
}

export function demoCloseBet(betId: string): void {
  const bet = getBetById(betId)
  if (!bet) throw new Error('Bet not found')
  saveBet({ ...bet, status: 'closed' })
}

export function demoReopenBet(betId: string): void {
  const bet = getBetById(betId)
  if (!bet) throw new Error('Bet not found')
  saveBet({ ...bet, status: 'open' })
}

export function demoDeleteBet(betId: string): void {
  removeBet(betId)
}

export function demoUpdateBetInfo(betId: string, name: string, description: string): void {
  const bet = getBetById(betId)
  if (!bet) throw new Error('Bet not found')
  saveBet({ ...bet, name: name.trim(), description: description.trim() })
}

export function demoGetRoster(): string[] {
  return getRoster()
}

// ─── Prediction bets ────────────────────────────────────────────────────────

export function demoCreatePredictionBet(
  name: string,
  description: string,
  goldAmount: number,
  closesAt: number,
  answerType: PredictionAnswerType,
  options: { choices?: string[]; line?: number; unit?: string },
): string {
  const id = generateId()
  const bet: BetPrediction = {
    id,
    kind: 'prediction',
    name: name.trim(),
    description: description.trim(),
    goldAmount,
    answerType,
    choices: options.choices,
    line: options.line,
    unit: options.unit,
    status: 'open',
    createdAt: Date.now(),
    closesAt,
    participants: [],
    serverId: DEMO_SERVER_ID,
  }
  saveBet(bet)
  return id
}

export function demoPlacePredictionAnswer(betId: string, answer: string): void {
  const bet = getBetById(betId) as BetPrediction | null
  if (!bet || bet.kind !== 'prediction') throw new Error('Prediction bet not found')
  if (bet.status !== 'open') throw new Error('Bet is not open')
  if (bet.participants.find(p => p.playerId === DEMO_USER_ID)) {
    throw new Error('You have already answered')
  }
  saveBet({
    ...bet,
    participants: [
      ...bet.participants,
      { kind: 'prediction', playerId: DEMO_USER_ID, playerName: DEMO_USERNAME, answer },
    ],
  } as Bet)
}

export function demoResolvePredictionBet(betId: string, realAnswer: string): void {
  const bet = getBetById(betId) as BetPrediction | null
  if (!bet || bet.kind !== 'prediction') throw new Error('Prediction bet not found')

  let winnerIds: string[] = []
  const participants = bet.participants

  if (bet.answerType === 'binary' || bet.answerType === 'multiple-choice') {
    winnerIds = participants.filter(p => p.answer === realAnswer).map(p => p.playerId)
  } else if (bet.answerType === 'over-under') {
    winnerIds = participants.filter(p => p.answer === realAnswer).map(p => p.playerId)
  } else {
    // closest-number: tiebreak by earliest entry
    const realNum = parseFloat(realAnswer)
    if (!isNaN(realNum) && participants.length > 0) {
      const sorted = [...participants].sort((a, b) => {
        const diffA = Math.abs(parseFloat(a.answer) - realNum)
        const diffB = Math.abs(parseFloat(b.answer) - realNum)
        return diffA - diffB
      })
      const bestDiff = Math.abs(parseFloat(sorted[0].answer) - realNum)
      winnerIds = sorted.filter(p => Math.abs(parseFloat(p.answer) - realNum) === bestDiff).map(p => p.playerId)
    }
  }

  saveBet({ ...bet, status: 'resolved', realAnswer, winnerIds } as Bet)
}

// ─── H2H bets ───────────────────────────────────────────────────────────────

export function demoCreateH2HBet(
  name: string,
  description: string,
  goldAmount: number,
  closesAt: number,
  sideA: string,
  sideB: string,
): string {
  const id = generateId()
  const bet: BetH2H = {
    id,
    kind: 'h2h',
    name: name.trim(),
    description: description.trim(),
    goldAmount,
    sides: [sideA.trim(), sideB.trim()],
    status: 'open',
    createdAt: Date.now(),
    closesAt,
    participants: [],
    serverId: DEMO_SERVER_ID,
  }
  saveBet(bet)
  return id
}

export function demoPlaceH2H(betId: string, sideIndex: 0 | 1): void {
  const bet = getBetById(betId) as BetH2H | null
  if (!bet || bet.kind !== 'h2h') throw new Error('H2H bet not found')
  if (bet.status !== 'open') throw new Error('Bet is not open')
  if (bet.participants.find(p => p.playerId === DEMO_USER_ID)) {
    throw new Error('You have already placed a bet')
  }
  saveBet({
    ...bet,
    participants: [
      ...bet.participants,
      { kind: 'h2h', playerId: DEMO_USER_ID, playerName: DEMO_USERNAME, sideIndex },
    ],
  } as Bet)
}

export function demoResolveH2H(betId: string, winningSideIndex: 0 | 1): void {
  const bet = getBetById(betId) as BetH2H | null
  if (!bet || bet.kind !== 'h2h') throw new Error('H2H bet not found')
  saveBet({ ...bet, status: 'resolved', winningSideIndex } as Bet)
}

// ─── Gold ledger ─────────────────────────────────────────────────────────────

export function demoGetGoldLedger(): LedgerEntry[] {
  const allBets = getAllBets()
  return computeLedger(allBets)
}
