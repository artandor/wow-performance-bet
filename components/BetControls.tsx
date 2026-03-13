'use client'

import { useState } from 'react'
import { Bet } from '@/types'
import { Button } from '@/components/ui/button'
import { Lock, Unlock, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react'

interface BetControlsProps {
  bet: Bet
  onClose: () => Promise<void>
  onReopen: () => Promise<void>
}

export default function BetControls({ bet, onClose, onReopen }: BetControlsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleClose = async () => {
    setIsLoading(true); setError(''); setSuccess('')
    try { await onClose(); setSuccess('Betting closed') }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed') }
    finally { setIsLoading(false) }
  }

  const handleReopen = async () => {
    setIsLoading(true); setError(''); setSuccess('')
    try { await onReopen(); setSuccess('Betting reopened') }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed') }
    finally { setIsLoading(false) }
  }

  if (bet.status === 'resolved') return null

  return (
    <div className="rounded-xl border border-white/8 bg-elevated/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert className="w-3.5 h-3.5 text-muted/50" />
        <p className="text-[11px] font-semibold text-muted/60 uppercase tracking-widest">Admin</p>
      </div>

      {bet.status === 'open' && (
        <Button
          onClick={handleClose}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="w-full gap-2 border-amber-500/20 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/40 hover:text-amber-300"
        >
          <Lock className="w-3.5 h-3.5" />
          {isLoading ? 'Closing…' : 'Close Betting'}
        </Button>
      )}

      {bet.status === 'closed' && (
        <Button
          onClick={handleReopen}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="w-full gap-2 border-goblin/25 text-goblin hover:bg-goblin/10 hover:border-goblin/50"
        >
          <Unlock className="w-3.5 h-3.5" />
          {isLoading ? 'Reopening…' : 'Reopen Betting'}
        </Button>
      )}

      {(error || success) && (
        <p className={`mt-2 flex items-center gap-1.5 text-xs ${error ? 'text-orange-400' : 'text-goblin'}`}>
          {error
            ? <AlertCircle className="w-3 h-3 flex-shrink-0" />
            : <CheckCircle2 className="w-3 h-3 flex-shrink-0" />}
          {error || success}
        </p>
      )}

      <p className="mt-2 text-[11px] text-muted/40 leading-snug">
        {bet.status === 'open'
          ? 'Close to lock entries and allow resolution.'
          : 'Reopen to allow new entries again.'}
      </p>
    </div>
  )
}
