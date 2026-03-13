/**
 * DEMO MODE - In-memory store with rich WoW dummy data.
 * Only used when DEMO_MODE=true. Not imported in production.
 */
import { Bet, BetGroupDps, BetPrediction, BetH2H, Roster } from '@/types'

export const DEMO_SERVER_ID = 'guild-sylvanas'
export const DEMO_USER_ID = 'demo-user-001'
export const DEMO_USERNAME = 'Aralindë'

export const DEMO_GUILDS = [
  { id: 'guild-sylvanas', name: 'Sylvanas EU', icon: null },
  { id: 'guild-garrosh', name: 'Garrosh US', icon: null },
]

const NOW = Date.now()
const DAY = 24 * 60 * 60 * 1000

const INITIAL_ROSTER: Roster = [
  // Tanks
  'Gorunn', 'Thaldrin', 'Morkvark',
  // Healers
  'Sylvaris', 'Elinna', 'Thalindra',
  // Ranged DPS
  'Aralindë', 'Pyrethis', 'Sylvankara', 'Vethindra', 'Arcturus', 'Kordath',
  // Melee DPS
  'Varok', 'Gornak', 'Thraxian', 'Keldrath', 'Zindar', 'Sareth', 'Brixmoor', 'Valdris',
  // Alts / extra
  'Grumdak', 'Lissara', 'Phaedros', 'Ysolde',
]

const INITIAL_BETS: Bet[] = [
  // ── OPEN GROUP-DPS BETS ───────────────────────────────────────────────────
  {
    id: 'bet-001',
    kind: 'group-dps',
    name: 'DPS Race - Top of the charts tonight',
    description:
      'Who will top the DPS charts during tonights Amirdrassil Mythic raid? Pick your winning trio! Results will be pulled directly from the Warcraft log.',
    goldAmount: 500,
    groupSize: 3,
    status: 'open',
    createdAt: NOW - 2 * DAY,
    closesAt: NOW + DAY,
    serverId: DEMO_SERVER_ID,
    participants: [
      { kind: 'group-dps', playerId: 'user-002', playerName: 'Pyrethis',   selectedGroup: ['Aralinde', 'Pyrethis', 'Arcturus'] },
      { kind: 'group-dps', playerId: 'user-003', playerName: 'Gornak',     selectedGroup: ['Sareth', 'Gornak', 'Keldrath'] },
      { kind: 'group-dps', playerId: 'user-004', playerName: 'Valdris',    selectedGroup: ['Aralinde', 'Pyrethis', 'Kordath'] },
      { kind: 'group-dps', playerId: 'user-005', playerName: 'Zindar',     selectedGroup: ['Zindar', 'Sareth', 'Thraxian'] },
      { kind: 'group-dps', playerId: 'user-006', playerName: 'Sylvankara', selectedGroup: ['Vethindra', 'Sylvankara', 'Aralinde'] },
    ],
  },
  {
    id: 'bet-002',
    kind: 'group-dps',
    name: 'Tank Challenge - Fewest damage taken on Fyrakk',
    description: 'Bet on which tank will take the least damage during our next Fyrakk Mythic attempt.',
    goldAmount: 250,
    groupSize: 1,
    status: 'open',
    createdAt: NOW - DAY,
    closesAt: NOW + 3 * DAY,
    serverId: DEMO_SERVER_ID,
    participants: [
      { kind: 'group-dps', playerId: 'user-002', playerName: 'Pyrethis', selectedGroup: ['Gorunn'] },
    ],
  } as BetGroupDps,
  {
    id: 'bet-003',
    kind: 'group-dps',
    name: 'Speed Run - New M+20 record',
    description: 'Which DPS duo will help us break our Mythic+20 speed record this week?',
    goldAmount: 1000,
    groupSize: 2,
    status: 'open',
    createdAt: NOW - 3 * DAY,
    closesAt: NOW + 4 * DAY,
    serverId: DEMO_SERVER_ID,
    participants: [],
  } as BetGroupDps,

  // ── CLOSED GROUP-DPS BETS ─────────────────────────────────────────────────
  {
    id: 'bet-004',
    kind: 'group-dps',
    name: 'Purple Parse - Amirdrassil HC full clear',
    description: 'Bet on the 5 players who will get a purple parse (90+) during our weekly HC clear. Results based on Thursday raid logs.',
    goldAmount: 750,
    groupSize: 5,
    status: 'closed',
    createdAt: NOW - 7 * DAY,
    closesAt: NOW - DAY,
    serverId: DEMO_SERVER_ID,
    participants: [
      { kind: 'group-dps', playerId: 'user-002', playerName: 'Pyrethis',   selectedGroup: ['Aralinde', 'Pyrethis', 'Sareth', 'Gornak', 'Vethindra'] },
      { kind: 'group-dps', playerId: 'user-003', playerName: 'Gornak',     selectedGroup: ['Aralinde', 'Arcturus', 'Sareth', 'Keldrath', 'Kordath'] },
      { kind: 'group-dps', playerId: 'user-004', playerName: 'Valdris',    selectedGroup: ['Pyrethis', 'Aralinde', 'Zindar', 'Gornak', 'Thraxian'] },
      { kind: 'group-dps', playerId: 'user-005', playerName: 'Zindar',     selectedGroup: ['Vethindra', 'Sylvankara', 'Sareth', 'Zindar', 'Brixmoor'] },
      { kind: 'group-dps', playerId: 'user-007', playerName: 'Brixmoor',   selectedGroup: ['Aralinde', 'Pyrethis', 'Sareth', 'Gornak', 'Keldrath'] },
      { kind: 'group-dps', playerId: 'user-008', playerName: 'Kordath',    selectedGroup: ['Kordath', 'Arcturus', 'Thraxian', 'Valdris', 'Zindar'] },
    ],
  } as BetGroupDps,
  {
    id: 'bet-005',
    kind: 'group-dps',
    name: 'Guild First - Tindral Sageswift Mythic',
    description: 'Bet on the exact group of 4 players still alive on the Tindral Mythic kill. Brutal fight - who makes it to the end?',
    goldAmount: 2000,
    groupSize: 4,
    status: 'closed',
    createdAt: NOW - 10 * DAY,
    closesAt: NOW - 2 * DAY,
    serverId: DEMO_SERVER_ID,
    participants: [
      { kind: 'group-dps', playerId: 'user-002', playerName: 'Pyrethis',   selectedGroup: ['Gorunn', 'Sylvaris', 'Aralinde', 'Pyrethis'] },
      { kind: 'group-dps', playerId: 'user-003', playerName: 'Gornak',     selectedGroup: ['Thaldrin', 'Elinna', 'Sareth', 'Gornak'] },
      { kind: 'group-dps', playerId: 'user-005', playerName: 'Zindar',     selectedGroup: ['Gorunn', 'Thalindra', 'Varok', 'Zindar'] },
      { kind: 'group-dps', playerId: 'user-006', playerName: 'Sylvankara', selectedGroup: ['Morkvark', 'Sylvaris', 'Sylvankara', 'Keldrath'] },
    ],
  } as BetGroupDps,

  // ── RESOLVED GROUP-DPS BETS ───────────────────────────────────────────────
  {
    id: 'bet-006',
    kind: 'group-dps',
    name: 'DPS Race - Gnarlroot first boss',
    description: 'Who will top DPS on Gnarlroot during the first reset of the week? Pick your top 3 damage dealers. Warcraft logs are final.',
    goldAmount: 400,
    groupSize: 3,
    status: 'resolved',
    createdAt: NOW - 14 * DAY,
    closesAt: NOW - 7 * DAY,
    serverId: DEMO_SERVER_ID,
    winningGroup: ['Aralinde', 'Pyrethis', 'Sareth'],
    participants: [
      { kind: 'group-dps', playerId: 'user-002', playerName: 'Pyrethis',   selectedGroup: ['Aralinde', 'Pyrethis', 'Sareth'] },
      { kind: 'group-dps', playerId: 'user-003', playerName: 'Gornak',     selectedGroup: ['Sareth', 'Gornak', 'Keldrath'] },
      { kind: 'group-dps', playerId: 'user-004', playerName: 'Valdris',    selectedGroup: ['Aralinde', 'Pyrethis', 'Kordath'] },
      { kind: 'group-dps', playerId: 'user-005', playerName: 'Zindar',     selectedGroup: ['Zindar', 'Sareth', 'Thraxian'] },
    ],
  } as BetGroupDps,
  {
    id: 'bet-007',
    kind: 'group-dps',
    name: 'Heal Race - Best combined HPS on Volcoross',
    description: 'Bet on the healer duo that will achieve the best combined HPS on our Volcoross Mythic attempt.',
    goldAmount: 600,
    groupSize: 2,
    status: 'resolved',
    createdAt: NOW - 20 * DAY,
    closesAt: NOW - 10 * DAY,
    serverId: DEMO_SERVER_ID,
    winningGroup: ['Sylvaris', 'Elinna'],
    participants: [
      { kind: 'group-dps', playerId: 'user-002', playerName: 'Pyrethis',   selectedGroup: ['Sylvaris', 'Elinna'] },
      { kind: 'group-dps', playerId: 'user-004', playerName: 'Valdris',    selectedGroup: ['Elinna', 'Thalindra'] },
      { kind: 'group-dps', playerId: 'user-005', playerName: 'Zindar',     selectedGroup: ['Sylvaris', 'Thalindra'] },
      { kind: 'group-dps', playerId: 'user-007', playerName: 'Brixmoor',   selectedGroup: ['Sylvaris', 'Elinna'] },
      { kind: 'group-dps', playerId: 'user-008', playerName: 'Kordath',    selectedGroup: ['Elinna', 'Sylvaris'] },
    ],
  } as BetGroupDps,

  // ── OPEN PREDICTION BETS ──────────────────────────────────────────────────
  {
    id: 'pred-001',
    kind: 'prediction',
    name: 'Death Count - Gornak on Fyrakk Saturday',
    description: 'How many times will Gornak die during the Saturday night Fyrakk raid? Closest guess wins the pot.',
    goldAmount: 300,
    answerType: 'closest-number',
    unit: 'deaths',
    status: 'open',
    createdAt: NOW - DAY,
    closesAt: NOW + 2 * DAY,
    serverId: DEMO_SERVER_ID,
    participants: [
      { kind: 'prediction', playerId: 'user-002', playerName: 'Pyrethis',   answer: '3' },
      { kind: 'prediction', playerId: 'user-003', playerName: 'Gornak',     answer: '1' },
      { kind: 'prediction', playerId: 'user-004', playerName: 'Valdris',    answer: '5' },
      { kind: 'prediction', playerId: 'user-005', playerName: 'Zindar',     answer: '7' },
    ],
  } as BetPrediction,
  {
    id: 'pred-002',
    kind: 'prediction',
    name: 'Over/Under - Wipes before Tindral Mythic kill',
    description: 'Will we wipe more than 15 times before our first Tindral Mythic kill? Line is set at 15 wipes.',
    goldAmount: 500,
    answerType: 'over-under',
    line: 15,
    unit: 'wipes',
    status: 'open',
    createdAt: NOW - 2 * DAY,
    closesAt: NOW + 3 * DAY,
    serverId: DEMO_SERVER_ID,
    participants: [
      { kind: 'prediction', playerId: 'user-002', playerName: 'Pyrethis',   answer: 'over' },
      { kind: 'prediction', playerId: 'user-003', playerName: 'Gornak',     answer: 'under' },
      { kind: 'prediction', playerId: 'user-004', playerName: 'Valdris',    answer: 'over' },
      { kind: 'prediction', playerId: 'user-006', playerName: 'Sylvankara', answer: 'under' },
    ],
  } as BetPrediction,
  {
    id: 'pred-003',
    kind: 'prediction',
    name: 'Who tops HPS this Thursday?',
    description: 'Which healer will top the HPS meter on our Thursday alt run? Vote your pick.',
    goldAmount: 200,
    answerType: 'multiple-choice',
    choices: ['Sylvaris', 'Elinna', 'Thalindra'],
    status: 'open',
    createdAt: NOW - DAY,
    closesAt: NOW + 4 * DAY,
    serverId: DEMO_SERVER_ID,
    participants: [
      { kind: 'prediction', playerId: 'user-004', playerName: 'Valdris',    answer: 'Sylvaris' },
      { kind: 'prediction', playerId: 'user-005', playerName: 'Zindar',     answer: 'Elinna' },
      { kind: 'prediction', playerId: 'user-007', playerName: 'Brixmoor',   answer: 'Sylvaris' },
    ],
  } as BetPrediction,

  // ── RESOLVED PREDICTION BET ───────────────────────────────────────────────
  {
    id: 'pred-004',
    kind: 'prediction',
    name: 'Will we down Fyrakk Mythic before reset?',
    description: 'Binary bet: yes or no, do we kill Fyrakk Mythic before the weekly reset on Tuesday?',
    goldAmount: 750,
    answerType: 'binary',
    choices: ['Yes', 'No'],
    status: 'resolved',
    realAnswer: 'Yes',
    winnerIds: ['user-002', 'user-005'],
    createdAt: NOW - 10 * DAY,
    closesAt: NOW - 5 * DAY,
    serverId: DEMO_SERVER_ID,
    participants: [
      { kind: 'prediction', playerId: 'user-002', playerName: 'Pyrethis',   answer: 'Yes' },
      { kind: 'prediction', playerId: 'user-003', playerName: 'Gornak',     answer: 'No' },
      { kind: 'prediction', playerId: 'user-005', playerName: 'Zindar',     answer: 'Yes' },
      { kind: 'prediction', playerId: 'user-008', playerName: 'Kordath',    answer: 'No' },
    ],
  } as BetPrediction,

  // ── OPEN H2H BETS ─────────────────────────────────────────────────────────
  {
    id: 'h2h-001',
    kind: 'h2h',
    name: 'Gornak vs Varok - Most kills on Fyrakk',
    description: 'Head-to-head: Gornak or Varok finishes with more kill assists on Fyrakk? Pick your side.',
    goldAmount: 1000,
    sides: ['Gornak wins', 'Varok wins'],
    status: 'open',
    createdAt: NOW - DAY,
    closesAt: NOW + 2 * DAY,
    serverId: DEMO_SERVER_ID,
    participants: [
      { kind: 'h2h', playerId: 'user-002', playerName: 'Pyrethis',   sideIndex: 0 },
      { kind: 'h2h', playerId: 'user-004', playerName: 'Valdris',    sideIndex: 1 },
      { kind: 'h2h', playerId: 'user-005', playerName: 'Zindar',     sideIndex: 0 },
      { kind: 'h2h', playerId: 'user-007', playerName: 'Brixmoor',   sideIndex: 1 },
    ],
  } as BetH2H,

  // ── RESOLVED H2H BET ──────────────────────────────────────────────────────
  {
    id: 'h2h-002',
    kind: 'h2h',
    name: 'Aralinde vs Pyrethis - Top DPS Gnarlroot',
    description: 'H2H between raid MVPs: who finishes higher on Gnarlroot? Classic rivalry.',
    goldAmount: 800,
    sides: ['Aralinde wins', 'Pyrethis wins'],
    winningSideIndex: 0,
    status: 'resolved',
    createdAt: NOW - 14 * DAY,
    closesAt: NOW - 7 * DAY,
    serverId: DEMO_SERVER_ID,
    participants: [
      { kind: 'h2h', playerId: 'user-003', playerName: 'Gornak',     sideIndex: 0 },
      { kind: 'h2h', playerId: 'user-004', playerName: 'Valdris',    sideIndex: 1 },
      { kind: 'h2h', playerId: 'user-005', playerName: 'Zindar',     sideIndex: 0 },
      { kind: 'h2h', playerId: 'user-008', playerName: 'Kordath',    sideIndex: 1 },
    ],
  } as BetH2H,
]

// ── Mutable in-memory state (persists for the lifetime of the dev server) ──

let _bets: Bet[] = [...INITIAL_BETS.map(b => ({ ...b }))]
let _roster: Roster = [...INITIAL_ROSTER]

// ── CRUD helpers ────────────────────────────────────────────────────────────

export function getAllBets(): Bet[] {
  return _bets.filter(b => b.serverId === DEMO_SERVER_ID)
}

export function getBetById(id: string): Bet | null {
  return _bets.find(b => b.id === id) ?? null
}

export function saveBet(bet: Bet): void {
  const idx = _bets.findIndex(b => b.id === bet.id)
  if (idx >= 0) {
    _bets[idx] = bet
  } else {
    _bets.push(bet)
  }
}

export function removeBet(id: string): void {
  _bets = _bets.filter(b => b.id !== id)
}

export function getRoster(): Roster {
  return [..._roster]
}

export function saveRoster(newRoster: Roster): void {
  _roster = [...new Set(newRoster)]
}

export function generateId(): string {
  return `bet-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
}
