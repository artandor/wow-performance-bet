import { Users } from 'lucide-react'

interface RosterDisplayProps {
  roster: string[]
}

/** Deterministic hue from player name (0–359) */
function playerHue(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff
  return h % 360
}

function PlayerBadge({ name }: { name: string }) {
  const hue = playerHue(name)
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium select-none cursor-default transition-all hover:scale-105 hover:brightness-110"
      style={{
        backgroundColor: `hsl(${hue}, 48%, 13%)`,
        borderColor:     `hsl(${hue}, 45%, 26%)`,
        color:           `hsl(${hue}, 65%, 70%)`,
      }}
    >
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{
          backgroundColor: `hsl(${hue}, 48%, 22%)`,
          color:           `hsl(${hue}, 70%, 80%)`,
        }}
      >
        {name[0]?.toUpperCase()}
      </span>
      {name}
    </div>
  )
}

export default function RosterDisplay({ roster }: RosterDisplayProps) {
  if (roster.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-white/10 text-muted">
        <Users className="w-10 h-10 mb-3 opacity-25" />
        <p className="text-sm">No players in roster. Import one to get started.</p>
      </div>
    )
  }

  const sorted = [...roster].sort((a, b) => a.localeCompare(b))

  return (
    <div className="rounded-xl border border-white/10 bg-surface p-6">
      <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-5">
        Current roster
        <span className="ml-2 px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/20 not-uppercase">
          {roster.length}
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {sorted.map((player, i) => (
          <PlayerBadge key={i} name={player} />
        ))}
      </div>
    </div>
  )
}
