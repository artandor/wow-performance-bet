import { Participant, getBetKind } from '@/types'
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
    
    // Upsert: replace existing entry if present, otherwise append
    const participants = bet.participants as Participant[]
    const existingIndex = participants.findIndex(
      p => p.playerId === participant.playerId
    )
    
    if (existingIndex >= 0) {
      participants[existingIndex] = participant
    } else {
      participants.push(participant)
    }
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
    
    ;(bet as { participants: Participant[] }).participants = (bet.participants as Participant[]).filter(
      p => p.playerId !== playerId
    )
    
    await updateBet(bet)
    
    return { success: true }
  } catch (error) {
    console.error('Error removing participant:', error)
    return { success: false, error: 'Failed to remove participant' }
  }
}
