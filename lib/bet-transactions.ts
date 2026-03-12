import { kv } from '@vercel/kv'
import { Bet, Participant } from '@/types'
import { getBet, updateBet } from './bet-storage'

export async function addParticipantToBet(
  betId: string,
  participant: Participant
): Promise<{ success: boolean; error?: string }> {
  try {
    const bet = await getBet(betId)
    
    if (!bet) {
      return { success: false, error: 'Bet not found' }
    }
    
    if (bet.status !== 'open') {
      return { success: false, error: 'Bet is not open for participation' }
    }
    
    // Check if participant already exists
    const existingParticipant = bet.participants.find(
      p => p.playerId === participant.playerId
    )
    
    if (existingParticipant) {
      return { success: false, error: 'You have already placed a bet' }
    }
    
    // Add participant
    bet.participants.push(participant)
    await updateBet(bet)
    
    return { success: true }
  } catch (error) {
    console.error('Error adding participant:', error)
    return { success: false, error: 'Failed to add participant' }
  }
}

export async function removeParticipantFromBet(
  betId: string,
  playerId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const bet = await getBet(betId)
    
    if (!bet) {
      return { success: false, error: 'Bet not found' }
    }
    
    bet.participants = bet.participants.filter(
      p => p.playerId !== playerId
    )
    
    await updateBet(bet)
    
    return { success: true }
  } catch (error) {
    console.error('Error removing participant:', error)
    return { success: false, error: 'Failed to remove participant' }
  }
}
