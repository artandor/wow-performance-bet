export type BetStatus = 'open' | 'closed' | 'resolved'

export interface Participant {
  playerId: string
  selectedGroup: string[] // exactly 5 player names
}

export interface Bet {
  id: string
  goldAmount: number
  status: BetStatus
  createdAt: number // timestamp
  closesAt: number // timestamp
  participants: Participant[]
  winningGroup?: string[] // 5 player names
}

export type Roster = string[] // array of player names
