'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Coins, AlertCircle, Plus, X } from 'lucide-react'
import { PredictionAnswerType } from '@/types'

interface PredictionBetFormProps {
  onCreateBet: (
    name: string,
    description: string,
    goldAmount: number,
    closesAt: number,
    answerType: PredictionAnswerType,
    options: { choices?: string[]; line?: number; unit?: string },
  ) => Promise<void>
}

const answerTypes: { value: PredictionAnswerType; label: string; description: string }[] = [
  { value: 'closest-number', label: 'Closest Number', description: 'Everyone guesses a number. Closest wins.' },
  { value: 'over-under',     label: 'Over / Under',   description: 'Set a line; bettors pick over or under.' },
  { value: 'binary',         label: 'Yes / No',        description: 'Simple two-option vote.' },
  { value: 'multiple-choice',label: 'Multiple Choice', description: 'You define the options.' },
]

export default function PredictionBetForm({ onCreateBet }: PredictionBetFormProps) {
  const [name, setName]               = useState('')
  const [description, setDescription] = useState('')
  const [goldAmount, setGoldAmount]   = useState('')
  const [closingTime, setClosingTime] = useState('')
  const [answerType, setAnswerType]   = useState<PredictionAnswerType>('closest-number')
  const [unit, setUnit]               = useState('')
  const [line, setLine]               = useState('')
  const [choices, setChoices]         = useState<string[]>(['', ''])
  const [isLoading, setIsLoading]     = useState(false)
  const [error, setError]             = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim())        { setError('Bet name is required'); return }
    if (!description.trim()) { setError('Description is required'); return }
    const gold = parseInt(goldAmount)
    if (isNaN(gold) || gold <= 0) { setError('Amount must be positive'); return }
    const closingDate = new Date(closingTime)
    if (closingDate.getTime() <= Date.now()) { setError('Closing date must be in the future'); return }

    const options: { choices?: string[]; line?: number; unit?: string } = {}
    if (unit.trim()) options.unit = unit.trim()

    if (answerType === 'over-under') {
      const l = parseFloat(line)
      if (isNaN(l)) { setError('Line value is required for Over/Under'); return }
      options.line = l
    }
    if (answerType === 'multiple-choice') {
      const filtered = choices.map(c => c.trim()).filter(Boolean)
      if (filtered.length < 2) { setError('At least 2 choices are required'); return }
      options.choices = filtered
    }
    if (answerType === 'binary') {
      options.choices = ['Yes', 'No']
    }

    setIsLoading(true)
    try {
      await onCreateBet(name.trim(), description.trim(), gold, closingDate.getTime(), answerType, options)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bet')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="pred-name">Bet Name</Label>
        <Input id="pred-name" value={name} onChange={e => setName(e.target.value)} placeholder="How many times will Gornak die on Fyrakk?" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pred-desc">Description</Label>
        <Textarea id="pred-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Saturday night raid, first 3 attempts only." rows={3} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pred-gold">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-gold" />
              Gold per participant
            </span>
          </Label>
          <Input id="pred-gold" type="number" value={goldAmount} onChange={e => setGoldAmount(e.target.value)} placeholder="500" min="1" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pred-close">Closing Date</Label>
          <Input id="pred-close" type="datetime-local" value={closingTime} onChange={e => setClosingTime(e.target.value)} required />
        </div>
      </div>

      {/* Answer type selector */}
      <div className="space-y-2">
        <Label>Answer Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {answerTypes.map(at => (
            <button
              key={at.value}
              type="button"
              onClick={() => setAnswerType(at.value)}
              className={`rounded-lg border p-3 text-left transition-all ${
                answerType === at.value
                  ? 'border-neon/60 bg-elevated text-bright'
                  : 'border-white/10 bg-surface text-muted hover:border-white/20'
              }`}
            >
              <p className="text-xs font-semibold">{at.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{at.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Unit label (for number-based types) */}
      {(answerType === 'closest-number' || answerType === 'over-under') && (
        <div className="space-y-2">
          <Label htmlFor="pred-unit">Unit label <span className="text-muted">(optional)</span></Label>
          <Input id="pred-unit" value={unit} onChange={e => setUnit(e.target.value)} placeholder="deaths, wipes, seconds…" />
        </div>
      )}

      {/* Over/Under line */}
      {answerType === 'over-under' && (
        <div className="space-y-2">
          <Label htmlFor="pred-line">Line value</Label>
          <Input id="pred-line" type="number" value={line} onChange={e => setLine(e.target.value)} placeholder="15" required />
        </div>
      )}

      {/* Multiple choice inputs */}
      {answerType === 'multiple-choice' && (
        <div className="space-y-2">
          <Label>Choices</Label>
          <div className="space-y-2">
            {choices.map((c, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={c}
                  onChange={e => {
                    const next = [...choices]; next[i] = e.target.value; setChoices(next)
                  }}
                  placeholder={`Choice ${i + 1}`}
                />
                {choices.length > 2 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setChoices(choices.filter((_, j) => j !== i))}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setChoices([...choices, ''])}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add choice
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800/50 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full bg-neon/20 hover:bg-neon/30 text-neon border border-neon/40">
        {isLoading ? 'Creating…' : 'Create Prediction Bet'}
      </Button>
    </form>
  )
}
