'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Coins, AlertCircle, Swords } from 'lucide-react'

interface H2HBetFormProps {
  roster: string[]
  onCreateBet: (
    name: string,
    description: string,
    goldAmount: number,
    closesAt: number,
    sideA: string,
    sideB: string,
  ) => Promise<void>
}

export default function H2HBetForm({ roster, onCreateBet }: H2HBetFormProps) {
  const [name, setName]               = useState('')
  const [description, setDescription] = useState('')
  const [goldAmount, setGoldAmount]   = useState('')
  const [closingTime, setClosingTime] = useState('')
  const [sideA, setSideA]             = useState('')
  const [sideB, setSideB]             = useState('')
  const [isLoading, setIsLoading]     = useState(false)
  const [error, setError]             = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim())        { setError('Bet name is required'); return }
    if (!description.trim()) { setError('Description is required'); return }
    if (!sideA)              { setError('Pick a player for Side A'); return }
    if (!sideB)              { setError('Pick a player for Side B'); return }
    if (sideA === sideB)     { setError('Both sides must be different players'); return }
    const gold = parseInt(goldAmount)
    if (isNaN(gold) || gold <= 0) { setError('Amount must be positive'); return }
    const closingDate = new Date(closingTime)
    if (closingDate.getTime() <= Date.now()) { setError('Closing date must be in the future'); return }

    setIsLoading(true)
    try {
      await onCreateBet(name.trim(), description.trim(), gold, closingDate.getTime(), sideA, sideB)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bet')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="h2h-name">Bet Name</Label>
        <Input id="h2h-name" value={name} onChange={e => setName(e.target.value)} placeholder="Gornak vs Varok - Most kills on Fyrakk" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="h2h-desc">Description</Label>
        <Textarea id="h2h-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Who performs better in Saturday's raid?" rows={3} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="h2h-gold">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-gold" />
              Gold per participant
            </span>
          </Label>
          <Input id="h2h-gold" type="number" value={goldAmount} onChange={e => setGoldAmount(e.target.value)} placeholder="1000" min="1" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="h2h-close">Closing Date</Label>
          <Input id="h2h-close" type="datetime-local" value={closingTime} onChange={e => setClosingTime(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-3">
        <Label>
          <span className="flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-gold" />
            The two challengers
          </span>
        </Label>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="space-y-1.5">
            <p className="text-xs text-gold uppercase tracking-wider font-semibold">Side A</p>
            <select
              value={sideA}
              onChange={e => setSideA(e.target.value)}
              required
              className="w-full rounded-md border border-gold/30 bg-elevated text-bright text-sm px-3 py-2 focus:outline-none focus:border-gold/60"
            >
              <option value="">Select player...</option>
              {roster.filter(p => p !== sideB).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center justify-center mt-5">
            <div className="w-9 h-9 rounded-full bg-elevated border border-white/15 flex items-center justify-center">
              <span className="text-[10px] font-black text-muted">VS</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-table uppercase tracking-wider font-semibold">Side B</p>
            <select
              value={sideB}
              onChange={e => setSideB(e.target.value)}
              required
              className="w-full rounded-md border border-table/30 bg-elevated text-bright text-sm px-3 py-2 focus:outline-none focus:border-table/60"
            >
              <option value="">Select player...</option>
              {roster.filter(p => p !== sideA).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800/50 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating...' : 'Create H2H Bet'}
      </Button>
    </form>
  )
}