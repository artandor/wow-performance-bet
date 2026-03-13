'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AlertCircle, Coins, Swords } from 'lucide-react'

interface BetCreationFormProps {
  roster: string[]
  onCreateBet: (name: string, description: string, goldAmount: number, groupSize: number, closesAt: number) => Promise<void>
}

export default function BetCreationForm({ onCreateBet }: BetCreationFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [goldAmount, setGoldAmount] = useState('')
  const [groupSize, setGroupSize] = useState('5')
  const [closingTime, setClosingTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) { setError('Bet name is required'); return }
    if (!description.trim()) { setError('Description is required'); return }
    const gold = parseInt(goldAmount)
    if (isNaN(gold) || gold <= 0) { setError('Amount must be positive'); return }
    const size = parseInt(groupSize)
    if (isNaN(size) || size < 1 || size > 40) { setError('Group size must be between 1 and 40'); return }
    const closingDate = new Date(closingTime)
    if (closingDate.getTime() <= Date.now()) { setError('Closing date must be in the future'); return }

    setIsLoading(true)
    try {
      await onCreateBet(name.trim(), description.trim(), gold, size, closingDate.getTime())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bet')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="bet-name">Bet Name</Label>
        <Input
          id="bet-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Race DPS - Amirdrassil HC"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bet-description">Description</Label>
        <Textarea
          id="bet-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Which group will get the best combined DPS?"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gold-amount">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-gold" />
              Gold per participant
            </span>
          </Label>
          <Input
            id="gold-amount"
            type="number"
            value={goldAmount}
            onChange={(e) => setGoldAmount(e.target.value)}
            placeholder="1000"
            min="1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="group-size">
            <span className="flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-muted" />
              Group Size
            </span>
          </Label>
          <Input
            id="group-size"
            type="number"
            min="1"
            max="40"
            value={groupSize}
            onChange={(e) => setGroupSize(e.target.value)}
            placeholder="5"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="closing-time">Closing Date</Label>
        <Input
          id="closing-time"
          type="datetime-local"
          value={closingTime}
          onChange={(e) => setClosingTime(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-orange-400 bg-table/10 border border-table/20 rounded-md px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? 'Creating...' : 'Create Bet'}
      </Button>
    </form>
  )
}
