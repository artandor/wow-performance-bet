import { Users, Swords, Brain } from 'lucide-react'
import { Bet, BetH2H, BetPrediction, getBetKind } from '@/types'

interface ParticipantListProps {
  bet: Bet
}

// ─── Group-DPS view ────────────────────────────────────────────────────────

function GroupDpsParticipantList({ bet }: { bet: Bet }) {
  const participants = bet.participants as { selectedGroup?: string[]; playerId: string; playerName?: string }[]

  const grouped = participants.reduce((acc, p) => {
    const group = p.selectedGroup
    if (!group) return acc
    const key = [...group].sort().join(',')
    if (!acc[key]) acc[key] = { group, bettors: [] }
    acc[key].bettors.push(p.playerName || p.playerId)
    return acc
  }, {} as Record<string, { group: string[]; bettors: string[] }>)

  const groups = Object.values(grouped)

  if (groups.length === 0) {
    return <EmptyState label="No group picks yet." />
  }

  return (
    <div className="space-y-2">
      {groups.map((g, i) => (
        <div key={i} className="rounded-lg border border-white/10 bg-elevated/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Group {i + 1}</p>
            <span className="text-xs text-muted">{g.bettors.length} bet{g.bettors.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {g.group.map(player => (
              <span key={player} className="px-2 py-0.5 bg-gold/15 text-gold border border-gold/20 rounded-full text-xs font-medium">
                {player}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {g.bettors.map(name => (
              <span key={name} className="px-2 py-0.5 bg-elevated text-muted border border-white/10 rounded-full text-xs">
                {name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Prediction view ───────────────────────────────────────────────────────

function PredictionParticipantList({ bet }: { bet: BetPrediction }) {
  const { participants, answerType } = bet

  if (participants.length === 0) {
    return <EmptyState label="No answers yet." />
  }

  // Group by answer value
  const byAnswer = participants.reduce((acc, p) => {
    const key = p.answer
    if (!acc[key]) acc[key] = []
    acc[key].push(p.playerName || p.playerId)
    return acc
  }, {} as Record<string, string[]>)

  // Order: for over-under show over first; for closest-number sort numerically; others alphabetically
  const keys = Object.keys(byAnswer).sort((a, b) => {
    if (answerType === 'closest-number') return parseFloat(a) - parseFloat(b)
    if (a === 'over') return -1
    if (b === 'over') return 1
    return a.localeCompare(b)
  })

  return (
    <div className="space-y-2">
      {keys.map(answer => (
        <div key={answer} className="rounded-lg border border-white/10 bg-elevated/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-neon-pink">
              {answer}{bet.unit && answerType === 'closest-number' ? ` ${bet.unit}` : ''}
            </p>
            <span className="text-xs text-muted">{byAnswer[answer].length} bet{byAnswer[answer].length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {byAnswer[answer].map(name => (
              <span key={name} className="px-2 py-0.5 bg-elevated text-muted border border-white/10 rounded-full text-xs">
                {name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── H2H view ──────────────────────────────────────────────────────────────

function H2HParticipantList({ bet }: { bet: BetH2H }) {
  const { participants, sides } = bet

  if (participants.length === 0) {
    return <EmptyState label="No sides picked yet." />
  }

  const sideA = participants.filter(p => p.sideIndex === 0)
  const sideB = participants.filter(p => p.sideIndex === 1)
  const total = participants.length

  return (
    <div className="grid grid-cols-2 gap-3">
      {[{ name: sides[0], list: sideA, color: 'gold' }, { name: sides[1], list: sideB, color: 'goblin' }].map(({ name, list, color }) => (
        <div key={name} className={`rounded-lg border p-3 ${color === 'gold' ? 'border-gold/20 bg-gold/5' : 'border-goblin/20 bg-goblin/5'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-xs font-semibold uppercase tracking-wider ${color === 'gold' ? 'text-gold' : 'text-goblin'}`}>{name}</p>
            <span className="text-xs text-muted">{list.length} · {total > 0 ? Math.round(list.length / total * 100) : 0}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${color === 'gold' ? 'bg-gold/60' : 'bg-goblin/60'}`}
              style={{ width: `${total > 0 ? (list.length / total) * 100 : 0}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {list.map(p => (
              <span key={p.playerId} className="px-2 py-0.5 bg-elevated text-muted border border-white/10 rounded-full text-xs">
                {p.playerName || p.playerId}
              </span>
            ))}
            {list.length === 0 && <span className="text-xs text-muted/50 italic">No one yet</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Shared empty state ────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-muted">
      <Users className="w-8 h-8 mb-2 opacity-25" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

const kindIcons: Record<string, React.ReactNode> = {
  'group-dps':  <Users  className="w-4 h-4 text-gold" />,
  'prediction': <Brain  className="w-4 h-4 text-neon-pink" />,
  'h2h':        <Swords className="w-4 h-4 text-goblin" />,
}

export default function ParticipantList({ bet }: ParticipantListProps) {
  const kind = getBetKind(bet)
  const count = bet.participants.length

  return (
    <div className="rounded-xl border border-white/10 bg-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        {kindIcons[kind] ?? <Users className="w-4 h-4 text-gold" />}
        <h3 className="text-sm font-semibold text-bright">Participants</h3>
        <span className="ml-1 text-xs font-normal text-muted">({count})</span>
      </div>

      {kind === 'prediction' && <PredictionParticipantList bet={bet as BetPrediction} />}
      {kind === 'h2h'        && <H2HParticipantList        bet={bet as BetH2H} />}
      {kind === 'group-dps'  && <GroupDpsParticipantList   bet={bet} />}
    </div>
  )
}

