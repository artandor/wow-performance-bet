'use client'

import { useState } from 'react'

interface DeleteBetButtonProps {
  betId: string
  onDelete: (betId: string) => Promise<void>
}

export default function DeleteBetButton({ betId, onDelete }: DeleteBetButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to bet detail page
    e.stopPropagation()
    
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }

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
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={handleCancel}
          className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
      title="Delete bet"
    >
      Delete
    </button>
  )
}
