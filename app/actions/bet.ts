'use server'

import { revalidatePath } from 'next/cache'
import { createBet, generateBetId, getBet, updateBet, getBetsByServerId, deleteBet } from '@/lib/bet-storage'
import { addParticipantToBet } from '@/lib/bet-transactions'
import { Bet, Participant } from '@/types'
import { getRoster } from '@/lib/roster-storage'
import { getBetStatus } from '@/lib/bet-status'
import { getServerContext, verifyServerAccess, getCurrentUserId, getCurrentUser } from '@/lib/server-context'

/**
 * Verify user has access to a server and return the serverId
 */
async function verifyAndGetServer(serverId: string): Promise<void> {
  const { hasAccess } = await verifyServerAccess(serverId)
  
  if (!hasAccess) {
    throw new Error('Access denied: You are not a member of this server')
  }
}

export async function createBetAction(name: string, description: string, goldAmount: number, groupSize: number, closesAt: number) {
  // Get server context
  const serverContext = await getServerContext()
  if (!serverContext) {
    throw new Error('No server context available')
  }
  
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

  if (!groupSize || groupSize < 1 || groupSize > 40) {
    throw new Error('Group size must be between 1 and 40')
  }

  if (closesAt <= Date.now()) {
    throw new Error('Closing time must be in the future')
  }

  const bet: Bet = {
    id: generateBetId(),
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
  revalidatePath('/bets')
  
  return bet.id
}

export async function placeBetAction(
  betId: string,
  selectedGroup: string[]
) {
  // Get current user info from session
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('You must be logged in to place a bet')
  }

  // Get the bet to check groupSize and serverId
  const bet = await getBet(betId)
  if (!bet) {
    throw new Error('Bet not found')
  }

  // Verify user has access to this bet's server
  if (bet.serverId) {
    await verifyAndGetServer(bet.serverId)
  }

  if (selectedGroup.length !== bet.groupSize) {
    throw new Error(`You must select exactly ${bet.groupSize} players`)
  }

  // Verify players are in roster
  const serverId = bet.serverId || 'default'
  const roster = await getRoster(serverId)
  const invalidPlayers = selectedGroup.filter(p => !roster.includes(p))
  if (invalidPlayers.length > 0) {
    throw new Error(`Players not in roster: ${invalidPlayers.join(', ')}`)
  }

  const participant: Participant = {
    playerId: user.id,
    playerName: user.name,
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
  const bet = await getBet(betId)
  
  if (!bet) {
    return null
  }
  
  // Verify access if bet has serverId
  if (bet.serverId) {
    const { hasAccess } = await verifyServerAccess(bet.serverId)
    if (!hasAccess) {
      throw new Error('Access denied: You are not a member of this server')
    }
  }
  
  return bet
}

export async function resolveBetAction(betId: string, winningGroup: string[]) {
  const bet = await getBet(betId)

  if (!bet) {
    throw new Error('Bet not found')
  }

  // Verify server access
  if (bet.serverId) {
    await verifyAndGetServer(bet.serverId)
  }

  const currentStatus = getBetStatus(bet)
  if (currentStatus === 'open') {
    throw new Error('Cannot resolve an open bet')
  }

  if (winningGroup.length !== bet.groupSize) {
    throw new Error(`Winning group must have exactly ${bet.groupSize} players`)
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
  const serverContext = await getServerContext()
  
  if (!serverContext) {
    return []
  }
  
  return await getBetsByServerId(serverContext.activeServerId)
}

export async function closeBetAction(betId: string) {
  const bet = await getBet(betId)

  if (!bet) {
    throw new Error('Bet not found')
  }

  // Verify server access
  if (bet.serverId) {
    await verifyAndGetServer(bet.serverId)
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

  // Verify server access
  if (bet.serverId) {
    await verifyAndGetServer(bet.serverId)
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

  // Verify server access
  if (bet.serverId) {
    await verifyAndGetServer(bet.serverId)
  }

  await deleteBet(betId)
  revalidatePath('/')
}

export async function updateBetInfoAction(betId: string, name: string, description: string) {
  const bet = await getBet(betId)

  if (!bet) {
    throw new Error('Bet not found')
  }

  // Verify server access
  if (bet.serverId) {
    await verifyAndGetServer(bet.serverId)
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
