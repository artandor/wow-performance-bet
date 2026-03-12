export type BetStatus = 'open' | 'closed' | 'resolved'

export interface Participant {
  playerId: string
  selectedGroup: string[] // player names matching bet's groupSize
}

export interface Bet {
  id: string
  name: string
  description: string
  goldAmount: number
  groupSize: number // number of players required per group
  status: BetStatus
  createdAt: number // timestamp
  closesAt: number // timestamp
  participants: Participant[]
  winningGroup?: string[] // player names matching groupSize
}

export type Roster = string[] // array of player names
