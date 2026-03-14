'use server'

import { revalidatePath } from 'next/cache'
import { createBet, generateBetId, getBet, updateBet, getBetsByServerId, deleteBet } from '@/lib/bet-storage'
import { addParticipantToBet } from '@/lib/bet-transactions'
import {
  Bet, BetGroupDps, BetPrediction, BetH2H,
  PredictionParticipant, H2HParticipant, GroupDpsParticipant,
  PredictionAnswerType, getBetKind,
} from '@/types'
import { getRoster } from '@/lib/roster-storage'
import { getBetStatus } from '@/lib/bet-status'
import { getServerContext, verifyServerAccess, getCurrentUserId, getCurrentUser } from '@/lib/server-context'
import * as demo from '@/lib/demo/bet-actions'
import { computeLedger } from '@/lib/ledger'
export type { LedgerEntry } from '@/lib/ledger'

const IS_DEMO = process.env.DEMO_MODE === 'true'

/**
 * Verify user has access to a server and return the serverId
 */
async function verifyAndGetServer(serverId: string): Promise<void> {
  const { hasAccess } = await verifyServerAccess(serverId)
  
  if (!hasAccess) {
    throw new Error('Access denied: You are not a member of this server')
  }
}

// ─── Group-DPS bet creation (original) ────────────────────────────────────

export async function createBetAction(name: string, description: string, goldAmount: number, groupSize: number, closesAt: number) {
  if (IS_DEMO) return demo.demoCreateBet(name, description, goldAmount, groupSize, closesAt)
  const serverContext = await getServerContext()
  if (!serverContext) throw new Error('No server context available')
  
  if (!name?.trim()) throw new Error('Bet name is required')
  if (!description?.trim()) throw new Error('Bet description is required')
  if (goldAmount <= 0) throw new Error('Gold amount must be positive')
  if (!groupSize || groupSize < 1 || groupSize > 40) throw new Error('Group size must be between 1 and 40')
  if (closesAt <= Date.now()) throw new Error('Closing time must be in the future')

  const bet: BetGroupDps = {
    id: generateBetId(),
    kind: 'group-dps',
    name: name.trim(),
    description: description.trim(),
    goldAmount,
    groupSize,
    status: 'open',
    createdAt: Date.now(),
    closesAt,
    participants: [],
    serverId: serverContext.activeServerId,
  }

  await createBet(bet)
  revalidatePath('/')
  return bet.id
}

// ─── Prediction bet creation ───────────────────────────────────────────────

export async function createPredictionBetAction(
  name: string,
  description: string,
  goldAmount: number,
  closesAt: number,
  answerType: PredictionAnswerType,
  options: { choices?: string[]; line?: number; unit?: string }
) {
  if (IS_DEMO) return demo.demoCreatePredictionBet(name, description, goldAmount, closesAt, answerType, options)
  const serverContext = await getServerContext()
  if (!serverContext) throw new Error('No server context available')

  if (!name?.trim()) throw new Error('Bet name is required')
  if (!description?.trim()) throw new Error('Bet description is required')
  if (goldAmount <= 0) throw new Error('Gold amount must be positive')
  if (closesAt <= Date.now()) throw new Error('Closing time must be in the future')
  if (answerType === 'multiple-choice') {
    const clean = (options.choices ?? []).map(c => c.trim()).filter(Boolean)
    if (clean.length < 2) throw new Error('Multiple-choice bets need at least 2 options')
    options.choices = clean
  }
  if (answerType === 'binary') {
    options.choices = ['Yes', 'No']
  }
  if (answerType === 'over-under') {
    if (options.line == null || isNaN(options.line)) throw new Error('Over/under bets need a numeric line')
  }

  const bet: BetPrediction = {
    id: generateBetId(),
    kind: 'prediction',
    name: name.trim(),
    description: description.trim(),
    goldAmount,
    answerType,
    choices: options.choices,
    line: options.line,
    unit: options.unit?.trim() || undefined,
    status: 'open',
    createdAt: Date.now(),
    closesAt,
    participants: [],
    serverId: serverContext.activeServerId,
  }

  await createBet(bet)
  revalidatePath('/')
  return bet.id
}

// ─── H2H bet creation ─────────────────────────────────────────────────────

export async function createH2HBetAction(
  name: string,
  description: string,
  goldAmount: number,
  closesAt: number,
  sideA: string,
  sideB: string,
) {
  if (IS_DEMO) return demo.demoCreateH2HBet(name, description, goldAmount, closesAt, sideA, sideB)
  const serverContext = await getServerContext()
  if (!serverContext) throw new Error('No server context available')

  if (!name?.trim()) throw new Error('Bet name is required')
  if (!description?.trim()) throw new Error('Bet description is required')
  if (goldAmount <= 0) throw new Error('Gold amount must be positive')
  if (closesAt <= Date.now()) throw new Error('Closing time must be in the future')
  if (!sideA?.trim() || !sideB?.trim()) throw new Error('Both sides must be named')

  const bet: BetH2H = {
    id: generateBetId(),
    kind: 'h2h',
    name: name.trim(),
    description: description.trim(),
    goldAmount,
    sides: [sideA.trim(), sideB.trim()],
    status: 'open',
    createdAt: Date.now(),
    closesAt,
    participants: [],
    serverId: serverContext.activeServerId,
  }

  await createBet(bet)
  revalidatePath('/')
  return bet.id
}

// ─── Place bet (group-dps) ────────────────────────────────────────────────

export async function placeBetAction(betId: string, selectedGroup: string[]) {
  if (IS_DEMO) { demo.demoPlaceBet(betId, selectedGroup); return }
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in to place a bet')

  const bet = await getBet(betId)
  if (!bet) throw new Error('Bet not found')
  if (bet.serverId) await verifyAndGetServer(bet.serverId)

  const kind = getBetKind(bet)
  if (kind !== 'group-dps') throw new Error('Use the correct action for this bet type')

  const b = bet as BetGroupDps
  if (selectedGroup.length !== b.groupSize) throw new Error(`You must select exactly ${b.groupSize} players`)

  const serverId = bet.serverId || 'default'
  const roster = await getRoster(serverId)
  const invalidPlayers = selectedGroup.filter(p => !roster.includes(p))
  if (invalidPlayers.length > 0) throw new Error(`Players not in roster: ${invalidPlayers.join(', ')}`)

  const participant: GroupDpsParticipant = {
    kind: 'group-dps',
    playerId: user.id,
    playerName: user.name,
    selectedGroup,
  }

  const result = await addParticipantToBet(betId, participant)
  if (!result.success) throw new Error(result.error || 'Failed to place bet')

  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}

// ─── Place prediction answer ────────────────────────────────────────────────

export async function placePredictionAnswerAction(betId: string, answer: string) {
  if (IS_DEMO) { demo.demoPlacePredictionAnswer(betId, answer); return }
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in')

  const bet = await getBet(betId)
  if (!bet) throw new Error('Bet not found')
  if (bet.serverId) await verifyAndGetServer(bet.serverId)
  if (getBetKind(bet) !== 'prediction') throw new Error('Not a prediction bet')
  if (bet.status !== 'open') throw new Error('Bet is not open')

  const b = bet as BetPrediction
  if (!answer?.trim()) throw new Error('Answer is required')

  const participant: PredictionParticipant = {
    kind: 'prediction',
    playerId: user.id,
    playerName: user.name,
    answer: answer.trim(),
  }

  const existingIndex = b.participants.findIndex(p => p.playerId === user.id)
  if (existingIndex >= 0) {
    b.participants[existingIndex] = participant
  } else {
    b.participants.push(participant)
  }
  await updateBet(b)
  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}

// ─── Place H2H side choice ─────────────────────────────────────────────────

export async function placeH2HAction(betId: string, sideIndex: number) {
  if (IS_DEMO) { demo.demoPlaceH2H(betId, sideIndex as 0 | 1); return }
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in')

  const bet = await getBet(betId)
  if (!bet) throw new Error('Bet not found')
  if (bet.serverId) await verifyAndGetServer(bet.serverId)
  if (getBetKind(bet) !== 'h2h') throw new Error('Not a h2h bet')
  if (bet.status !== 'open') throw new Error('Bet is not open')

  const b = bet as BetH2H
  if (sideIndex !== 0 && sideIndex !== 1) throw new Error('Invalid side')

  const participant: H2HParticipant = {
    kind: 'h2h',
    playerId: user.id,
    playerName: user.name,
    sideIndex,
  }

  const existingIndex = b.participants.findIndex(p => p.playerId === user.id)
  if (existingIndex >= 0) {
    b.participants[existingIndex] = participant
  } else {
    b.participants.push(participant)
  }
  await updateBet(b)
  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}

// ─── Get bet ───────────────────────────────────────────────────────────────

export async function getBetAction(betId: string) {
  if (IS_DEMO) return demo.demoGetBet(betId)
  const bet = await getBet(betId)
  if (!bet) return null
  if (bet.serverId) {
    const { hasAccess } = await verifyServerAccess(bet.serverId)
    if (!hasAccess) throw new Error('Access denied: You are not a member of this server')
  }
  return bet
}

// ─── Get current user's existing answer ───────────────────────────────────

export async function getCurrentUserAnswerAction(betId: string) {
  if (IS_DEMO) return demo.demoGetCurrentUserAnswer(betId)
  const user = await getCurrentUser()
  if (!user) return null
  const bet = await getBet(betId)
  if (!bet) return null
  const participants = bet.participants as import('@/types').Participant[]
  return participants.find(p => p.playerId === user.id) ?? null
}

// ─── Resolve actions ───────────────────────────────────────────────────────

export async function resolveBetAction(betId: string, winningGroup: string[]) {
  if (IS_DEMO) { demo.demoResolveBet(betId, winningGroup); return }
  const bet = await getBet(betId)
  if (!bet) throw new Error('Bet not found')

  const b = bet as { groupSize?: number; status: string; winningGroup?: string[]; participants: { selectedGroup?: string[] }[] }
  if (b.groupSize != null && winningGroup.length !== b.groupSize) {
    throw new Error(`Winning group must have exactly ${b.groupSize} players`)
  }

  bet.status = 'resolved'
  ;(bet as BetGroupDps).winningGroup = winningGroup
  await updateBet(bet)
  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}

export async function resolvePredictionBetAction(betId: string, realAnswer: string) {
  if (IS_DEMO) { demo.demoResolvePredictionBet(betId, realAnswer); return }
  const bet = await getBet(betId)
  if (!bet) throw new Error('Bet not found')
  if (getBetKind(bet) !== 'prediction') throw new Error('Not a prediction bet')
  if (bet.serverId) await verifyAndGetServer(bet.serverId)

  const b = bet as BetPrediction
  if (b.status !== 'closed') throw new Error('Bet must be closed before resolving')

  const winnerIds = computePredictionWinners(b, realAnswer.trim())
  b.realAnswer = realAnswer.trim()
  b.winnerIds = winnerIds
  b.status = 'resolved'
  await updateBet(b)
  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}

export async function resolveH2HBetAction(betId: string, winningSideIndex: number) {
  if (IS_DEMO) { demo.demoResolveH2H(betId, winningSideIndex as 0 | 1); return }
  const bet = await getBet(betId)
  if (!bet) throw new Error('Bet not found')
  if (getBetKind(bet) !== 'h2h') throw new Error('Not a h2h bet')
  if (bet.serverId) await verifyAndGetServer(bet.serverId)

  const b = bet as BetH2H
  if (b.status !== 'closed') throw new Error('Bet must be closed before resolving')
  if (winningSideIndex !== 0 && winningSideIndex !== 1) throw new Error('Invalid side index')

  b.winningSideIndex = winningSideIndex
  b.status = 'resolved'
  await updateBet(b)
  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}

// ─── Compute prediction winners ────────────────────────────────────────────

function computePredictionWinners(bet: BetPrediction, realAnswer: string): string[] {
  const { answerType, participants } = bet

  if (answerType === 'binary' || answerType === 'multiple-choice') {
    return participants
      .filter(p => p.answer.toLowerCase() === realAnswer.toLowerCase())
      .map(p => p.playerId)
  }

  if (answerType === 'over-under') {
    const line = bet.line ?? 0
    const real = parseFloat(realAnswer)
    const correct = real > line ? 'over' : 'under'
    return participants
      .filter(p => p.answer.toLowerCase() === correct)
      .map(p => p.playerId)
  }

  if (answerType === 'closest-number') {
    const real = parseFloat(realAnswer)
    if (isNaN(real)) return []
    let minDiff = Infinity
    for (const p of participants) {
      const diff = Math.abs(parseFloat(p.answer) - real)
      if (diff < minDiff) minDiff = diff
    }
    // All entries with equal closest diff — tiebreak by earlier submission order
    const closest = participants.filter(p => Math.abs(parseFloat(p.answer) - real) === minDiff)
    return [closest[0].playerId] // earliest entry wins
  }

  return []
}

// ─── Get all bets ──────────────────────────────────────────────────────────

export async function getAllBetsAction() {
  if (IS_DEMO) return demo.demoGetAllBets()
  const serverContext = await getServerContext()
  if (!serverContext) return []
  return await getBetsByServerId(serverContext.activeServerId)
}

// ─── Gold ledger ───────────────────────────────────────────────────────────

export async function getGoldLedgerAction() {
  if (IS_DEMO) return demo.demoGetGoldLedger()
  const serverContext = await getServerContext()
  if (!serverContext) return []
  const bets = await getBetsByServerId(serverContext.activeServerId)
  return computeLedger(bets)
}

// ─── Status controls (shared) ──────────────────────────────────────────────

export async function closeBetAction(betId: string) {
  if (IS_DEMO) { demo.demoCloseBet(betId); return }
  const bet = await getBet(betId)
  if (!bet) throw new Error('Bet not found')
  if (bet.serverId) await verifyAndGetServer(bet.serverId)
  if (bet.status === 'resolved') throw new Error('Cannot close a resolved bet')
  bet.status = 'closed'
  await updateBet(bet)
  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}

export async function reopenBetAction(betId: string) {
  if (IS_DEMO) { demo.demoReopenBet(betId); return }
  const bet = await getBet(betId)
  if (!bet) throw new Error('Bet not found')
  if (bet.serverId) await verifyAndGetServer(bet.serverId)
  if (bet.status === 'resolved') throw new Error('Cannot reopen a resolved bet')
  bet.status = 'open'
  await updateBet(bet)
  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}

export async function deleteBetAction(betId: string) {
  if (IS_DEMO) { demo.demoDeleteBet(betId); return }
  const bet = await getBet(betId)
  if (!bet) throw new Error('Bet not found')
  if (bet.serverId) await verifyAndGetServer(bet.serverId)
  await deleteBet(betId)
  revalidatePath('/')
}

export async function updateBetInfoAction(betId: string, name: string, description: string) {
  if (IS_DEMO) { demo.demoUpdateBetInfo(betId, name, description); return }
  const bet = await getBet(betId)
  if (!bet) throw new Error('Bet not found')
  if (bet.serverId) await verifyAndGetServer(bet.serverId)
  if (!name?.trim()) throw new Error('Bet name is required')
  if (!description?.trim()) throw new Error('Bet description is required')
  bet.name = name.trim()
  bet.description = description.trim()
  await updateBet(bet)
  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}
