'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface DeleteBetButtonProps {
  betId: string
  onDelete: (betId: string) => Promise<void>
}

export default function DeleteBetButton({ betId, onDelete }: DeleteBetButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!showConfirm) { setShowConfirm(true); return }
    setIsDeleting(true)
    try {
      await onDelete(betId)
    } catch (error) {
      console.error('Failed to delete bet:', error)
      alert('Failed to delete bet')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowConfirm(false)
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? '...' : 'Confirm'}
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleDelete}
      title="Delete bet"
      className="text-muted hover:text-table hover:bg-table/10"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
