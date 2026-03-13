export type BetStatus = 'open' | 'closed' | 'resolved'

/** Discriminator for the three bet kinds. */
export type BetKind = 'group-dps' | 'prediction' | 'h2h'

// ─── Participant shapes ────────────────────────────────────────────────────

/** Used by group-dps bets: bettor picks a group of raid players. */
export interface GroupDpsParticipant {
  kind: 'group-dps'
  playerId: string
  playerName?: string
  selectedGroup: string[]
}

/** Used by prediction bets: bettor submits a free-form or numeric answer. */
export interface PredictionParticipant {
  kind: 'prediction'
  playerId: string
  playerName?: string
  /** The answer submitted (number as string for closest-wins, or option label). */
  answer: string
}

/** Used by h2h bets: bettor picks a side. */
export interface H2HParticipant {
  kind: 'h2h'
  playerId: string
  playerName?: string
  /** Which side the bettor chose (index into BetH2H.sides). */
  sideIndex: number
}

/**
 * Legacy shape kept for backwards-compatibility when `kind` is absent.
 * All new code always writes one of the typed shapes above.
 */
export interface LegacyParticipant {
  playerId: string
  playerName?: string
  selectedGroup: string[]
}

export type Participant =
  | GroupDpsParticipant
  | PredictionParticipant
  | H2HParticipant
  | LegacyParticipant

// ─── Answer-type for prediction bets ──────────────────────────────────────

/** How the winner(s) are determined for a prediction bet. */
export type PredictionAnswerType =
  | 'closest-number'  // Everyone guesses an integer; closest wins. Ties go to earliest entry.
  | 'over-under'      // Creator sets a numeric line; bettors pick Over or Under.
  | 'binary'          // Simple yes / no.
  | 'multiple-choice' // Creator pre-defines text options; bettors pick one.

// ─── Bet shapes ───────────────────────────────────────────────────────────

/** Shared fields present on every bet of every kind. */
interface BetBase {
  id: string
  name: string
  description: string
  goldAmount: number
  status: BetStatus
  createdAt: number
  closesAt: number
  serverId?: string
}

/** Classic group-DPS race bet (original type, kept 100 % backwards-compatible). */
export interface BetGroupDps extends BetBase {
  kind: 'group-dps'
  groupSize: number
  participants: (GroupDpsParticipant | LegacyParticipant)[]
  winningGroup?: string[]
}

/** Free-form prediction bet (number guess, over/under, binary, multi-choice). */
export interface BetPrediction extends BetBase {
  kind: 'prediction'
  answerType: PredictionAnswerType
  /** For 'multiple-choice' and 'binary' (auto-filled as ['Yes','No']). */
  choices?: string[]
  /** Numeric line used only for 'over-under'. */
  line?: number
  /** Unit label shown next to numbers, e.g. "deaths", "wipes", "seconds". */
  unit?: string
  participants: PredictionParticipant[]
  /** Set at resolution time. */
  realAnswer?: string
  winnerIds?: string[]
}

/** Head-to-head challenge: two named sides, any number of bettors per side. */
export interface BetH2H extends BetBase {
  kind: 'h2h'
  /** Exactly two sides. */
  sides: [string, string]
  participants: H2HParticipant[]
  /** Index of the winning side (0 or 1), set at resolution. */
  winningSideIndex?: number
}

/**
 * Union of all bet kinds.
 * Legacy bets stored without `kind` will be treated as group-dps at read-time.
 */
export type Bet = BetGroupDps | BetPrediction | BetH2H | LegacyBet

/**
 * Legacy shape: bets written before the `kind` field was introduced.
 * Satisfies the original Bet interface so old data keeps working.
 */
export interface LegacyBet extends BetBase {
  kind?: undefined
  groupSize: number
  participants: LegacyParticipant[]
  winningGroup?: string[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Treat a bet without `kind` as a group-dps bet. */
export function getBetKind(bet: Bet): BetKind {
  return (bet as BetGroupDps).kind ?? 'group-dps'
}

export type Roster = string[]
