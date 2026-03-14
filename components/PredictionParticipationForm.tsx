'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { BetPrediction } from '@/types'

interface PredictionParticipationFormProps {
  bet: BetPrediction
  onSubmit: (answer: string) => Promise<void>
  existingAnswer?: string
}

export default function PredictionParticipationForm({ bet, onSubmit, existingAnswer }: PredictionParticipationFormProps) {
  const isUpdate = !!existingAnswer
  const [answer, setAnswer] = useState(existingAnswer ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (value: string) => {
    setError('')
    if (!value.trim()) { setError('An answer is required'); return }
    setIsLoading(true)
    try {
      await onSubmit(value.trim())
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-goblin">
        <CheckCircle2 className="w-8 h-8" />
        <p className="font-semibold">{isUpdate ? 'Bet updated!' : 'Bet placed!'}</p>
      </div>
    )
  }

  const { answerType, line, unit, choices } = bet

  if (answerType === 'binary' || answerType === 'multiple-choice') {
    const options = answerType === 'binary' ? ['Yes', 'No'] : (choices ?? [])
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">{isUpdate ? 'Update your answer:' : 'Pick your answer:'}</p>
        <div className="flex flex-wrap gap-2">
          {options.map(opt => (
            <Button
              key={opt}
              type="button"
              disabled={isLoading}
              onClick={() => handleSubmit(opt)}
              className={`bg-neon/10 hover:bg-neon/20 text-neon border ${existingAnswer === opt ? 'border-neon ring-1 ring-neon' : 'border-neon/30'}`}
            >
              {opt}
            </Button>
          ))}
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800/50 px-3 py-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>
    )
  }

  if (answerType === 'over-under') {
    return (
      <div className="space-y-3">
        {line !== undefined && (
          <p className="text-sm text-muted">
            Line: <span className="text-bright font-semibold">{line}{unit ? ` ${unit}` : ''}</span>
          </p>
        )}
        <div className="flex gap-2">
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => handleSubmit('over')}
            className={`flex-1 bg-gold/10 hover:bg-gold/20 text-gold border ${existingAnswer === 'over' ? 'border-gold ring-1 ring-gold' : 'border-gold/30'}`}
          >
            Over
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => handleSubmit('under')}
            className={`flex-1 bg-surface hover:bg-elevated text-muted border ${existingAnswer === 'under' ? 'border-white/40 ring-1 ring-white/40' : 'border-white/10'}`}
          >
            Under
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800/50 px-3 py-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>
    )
  }

  // closest-number
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Your guess {unit ? `(in ${unit})` : ''}:
      </p>
      <div className="flex gap-2">
        <Input
          type="number"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="0"
          className="max-w-[140px]"
        />
        <Button
          type="button"
          disabled={isLoading || !answer.trim()}
          onClick={() => handleSubmit(answer)}
          className="bg-neon/10 hover:bg-neon/20 text-neon border border-neon/30"
        >
          {isLoading ? 'Submitting…' : isUpdate ? 'Update' : 'Submit'}
        </Button>
      </div>
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800/50 px-3 py-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
