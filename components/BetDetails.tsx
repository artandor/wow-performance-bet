'use client'

import { useState } from 'react'
import { Bet, getBetKind } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Coins, Trophy, Clock, Users, Pencil, Check, X, AlertCircle, Swords, Brain, Users2 } from 'lucide-react'
import { getTimeRemaining } from '@/lib/bet-status'

interface BetDetailsProps {
  bet: Bet
  onUpdate: (name: string, description: string) => Promise<void>
}

const KIND_META = {
  'group-dps':  { label: 'Group DPS',    icon: Users2,  border: 'bg-gold',           badge: 'text-gold     bg-gold/10     border-gold/25' },
  'prediction': { label: 'Prediction',   icon: Brain,   border: 'bg-neon-pink',      badge: 'text-neon-pink bg-neon-pink/10 border-neon-pink/25' },
  'h2h':        { label: 'Head-to-Head', icon: Swords,  border: 'bg-goblin',         badge: 'text-goblin   bg-goblin/10   border-goblin/25' },
} as const

const STATUS_META = {
  'open':     { label: 'Open',     classes: 'text-goblin     bg-goblin/10     border-goblin/25' },
  'closed':   { label: 'Closed',   classes: 'text-amber-400  bg-amber-400/10  border-amber-400/25' },
  'resolved': { label: 'Resolved', classes: 'text-muted      bg-white/5       border-white/10' },
} as const

function StatCell({ icon, label, value, sub, accent }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; accent?: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-shrink-0 opacity-60">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted uppercase tracking-wider leading-none mb-0.5">{label}</p>
        <p className={`text-sm font-bold leading-tight ${accent ?? 'text-bright'}`}>{value}</p>
        {sub && <p className="text-[11px] text-muted/60 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function BetDetails({ bet, onUpdate }: BetDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(bet.name)
  const [editDesc, setEditDesc] = useState(bet.description)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const kind = getBetKind(bet)
  const km = KIND_META[kind] ?? KIND_META['group-dps']
  const sm = STATUS_META[bet.status]
  const KindIcon = km.icon
  const potSize = bet.goldAmount * bet.participants.length

  const handleSave = async () => {
    setError('')
    if (!editName.trim()) { setError('Name is required'); return }
    if (!editDesc.trim()) { setError('Description is required'); return }
    setIsLoading(true)
    try {
      await onUpdate(editName, editDesc)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally { setIsLoading(false) }
  }

  const handleCancel = () => {
    setEditName(bet.name); setEditDesc(bet.description); setError(''); setIsEditing(false)
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-surface overflow-hidden">
      {/* Kind-coloured top accent line */}
      <div className={`h-0.5 w-full ${km.border}`} />

      <div className="p-6">
        {/* ── Top bar: kind + status + edit ─────────────────────────── */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${km.badge}`}>
            <KindIcon className="w-3 h-3" />
            {km.label}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${sm.classes}`}>
            {sm.label}
          </span>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="ml-auto flex items-center gap-1.5 text-xs text-muted/60 hover:text-bright transition-colors px-2 py-1 rounded-lg hover:bg-elevated"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          )}
        </div>

        {/* ── Title + description (or edit form) ───────────────────── */}
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted">Title</Label>
              <Input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="mt-1 font-semibold"
                autoFocus
              />
            </div>
            <div>
              <Label className="text-xs text-muted">Description</Label>
              <Textarea
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleSave} disabled={isLoading} className="gap-1.5">
                <Check className="w-3.5 h-3.5" />{isLoading ? 'Saving…' : 'Save'}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} disabled={isLoading} className="gap-1.5">
                <X className="w-3.5 h-3.5" />Cancel
              </Button>
              {error && (
                <p className="flex items-center gap-1 text-xs text-orange-400">
                  <AlertCircle className="w-3 h-3" />{error}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold text-bright leading-tight mb-2">{bet.name}</h1>
            <p className="text-sm text-muted/80 leading-relaxed">{bet.description}</p>
          </>
        )}

        {/* ── Stats strip ──────────────────────────────────────────── */}
        {!isEditing && (
          <div className="mt-5 pt-5 border-t border-white/8 flex flex-wrap gap-x-6 gap-y-3">
            <StatCell
              icon={<Coins className="w-4 h-4 text-gold" />}
              label="Entry fee"
              value={`${bet.goldAmount.toLocaleString()} g`}
              accent="text-gold"
            />
            {potSize > 0 && (
              <StatCell
                icon={<Trophy className="w-4 h-4 text-goblin" />}
                label="Current pot"
                value={`${potSize.toLocaleString()} g`}
                accent="text-goblin"
              />
            )}
            <StatCell
              icon={<Users className="w-4 h-4" />}
              label="Participants"
              value={bet.participants.length === 0 ? 'None yet' : `${bet.participants.length}`}
            />
            <StatCell
              icon={<Clock className="w-4 h-4" />}
              label={bet.status === 'open' ? 'Closes' : 'Closed'}
              value={new Date(bet.closesAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              sub={bet.status === 'open' ? getTimeRemaining(bet.closesAt) : undefined}
            />
          </div>
        )}
      </div>
    </div>
  )
}
