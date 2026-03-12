import { Bet, BetStatus } from '@/types'

export function getBetStatus(bet: Bet): BetStatus {
  // If already resolved, keep that status
  if (bet.status === 'resolved') {
    return 'resolved'
  }

  // Check if bet should be auto-closed based on time
  const now = Date.now()
  if (now >= bet.closesAt && bet.status !== 'open') {
    // Time has passed AND bet is currently closed -> stay closed
    return 'closed'
  }
  
  // If time has passed but bet is manually open, respect that
  // Otherwise, use the current stored status
  // This allows both manual close/reopen at any time
  return bet.status
}

export function updateBetStatus(bet: Bet): Bet {
  const currentStatus = getBetStatus(bet)
  
  // Only update if status actually changed
  if (currentStatus !== bet.status) {
    return {
      ...bet,
      status: currentStatus,
    }
  }

  return bet
}

export function canParticipate(bet: Bet): boolean {
  // Check the actual status after any time-based updates
  const status = getBetStatus(bet)
  return status === 'open'
}

export function canResolve(bet: Bet): boolean {
  // Check the actual status after any time-based updates
  const status = getBetStatus(bet)
  return status === 'closed' || status === 'resolved'
}

export function getTimeRemaining(closesAt: number): string {
  const now = Date.now()
  const diff = closesAt - now

  if (diff <= 0) {
    return 'Closed'
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h remaining`
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`
  }

  return `${minutes}m remaining`
}
