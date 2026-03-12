'use server'

import { revalidatePath } from 'next/cache'
import { createBet, generateBetId, getBet, updateBet, getAllBets, deleteBet } from '@/lib/bet-storage'
import { addParticipantToBet } from '@/lib/bet-transactions'
import { Bet, Participant } from '@/types'
import { getRoster } from '@/lib/roster-storage'
import { getBetStatus } from '@/lib/bet-status'

export async function createBetAction(name: string, description: string, goldAmount: number, closesAt: number) {
  // Validation
  if (!name || !name.trim()) {
    throw new Error('Bet name is required')
  }

  if (!description || !description.trim()) {
    throw new Error('Bet description is required')
  }

  if (goldAmount <= 0) {
    throw new Error('Gold amount must be positive')
  }

  if (closesAt <= Date.now()) {
    throw new Error('Closing time must be in the future')
  }

  const bet: Bet = {
    id: generateBetId(),
    name: name.trim(),
    description: description.trim(),
    goldAmount,
    status: 'open',
    createdAt: Date.now(),
    closesAt,
    participants: [],
  }

  await createBet(bet)
  revalidatePath('/')
  revalidatePath('/bets')
  
  return bet.id
}

export async function placeBetAction(
  betId: string,
  playerId: string,
  selectedGroup: string[]
) {
  // Validation
  if (!playerId || !playerId.trim()) {
    throw new Error('Player ID is required')
  }

  if (selectedGroup.length !== 5) {
    throw new Error('You must select exactly 5 players')
  }

  // Verify players are in roster
  const roster = await getRoster()
  const invalidPlayers = selectedGroup.filter(p => !roster.includes(p))
  if (invalidPlayers.length > 0) {
    throw new Error(`Players not in roster: ${invalidPlayers.join(', ')}`)
  }

  const participant: Participant = {
    playerId: playerId.trim(),
    selectedGroup,
  }

  const result = await addParticipantToBet(betId, participant)

  if (!result.success) {
    throw new Error(result.error || 'Failed to place bet')
  }

  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}

export async function getBetAction(betId: string) {
  return await getBet(betId)
}

export async function resolveBetAction(betId: string, winningGroup: string[]) {
  const bet = await getBet(betId)

  if (!bet) {
    throw new Error('Bet not found')
  }

  const currentStatus = getBetStatus(bet)
  if (currentStatus === 'open') {
    throw new Error('Cannot resolve an open bet')
  }

  if (winningGroup.length !== 5) {
    throw new Error('Winning group must have exactly 5 players')
  }

  // Check if any participant selected this group
  const hasWinners = bet.participants.some(
    (p) => p.selectedGroup.sort().join(',') === winningGroup.sort().join(',')
  )

  bet.status = 'resolved'
  bet.winningGroup = winningGroup

  await updateBet(bet)
  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}

export async function getAllBetsAction() {
  return await getAllBets()
}

export async function closeBetAction(betId: string) {
  const bet = await getBet(betId)

  if (!bet) {
    throw new Error('Bet not found')
  }

  if (bet.status === 'resolved') {
    throw new Error('Cannot close a resolved bet')
  }

  bet.status = 'closed'
  await updateBet(bet)
  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}

export async function reopenBetAction(betId: string) {
  const bet = await getBet(betId)

  if (!bet) {
    throw new Error('Bet not found')
  }

  if (bet.status === 'resolved') {
    throw new Error('Cannot reopen a resolved bet')
  }

  bet.status = 'open'
  await updateBet(bet)
  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}

export async function deleteBetAction(betId: string) {
  const bet = await getBet(betId)

  if (!bet) {
    throw new Error('Bet not found')
  }

  await deleteBet(betId)
  revalidatePath('/')
}

export async function updateBetInfoAction(betId: string, name: string, description: string) {
  const bet = await getBet(betId)

  if (!bet) {
    throw new Error('Bet not found')
  }

  // Validation
  if (!name || !name.trim()) {
    throw new Error('Bet name is required')
  }

  if (!description || !description.trim()) {
    throw new Error('Bet description is required')
  }

  bet.name = name.trim()
  bet.description = description.trim()
  
  await updateBet(bet)
  revalidatePath(`/bets/${betId}`)
  revalidatePath('/')
}
